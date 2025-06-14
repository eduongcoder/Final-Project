package com.example.demo.controller;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Duration;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

import org.apache.http.HttpHeaders;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.entity.TtsRequest;
import com.example.demo.repository.ITtsRequestRepository;
import com.example.demo.service.TextService;
import com.example.demo.service.UploadFileService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;

@RestController
@RequestMapping("/api/tts")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class TTSController {

	private static final Logger logger = LoggerFactory.getLogger(TTSController.class);

	TextService service;
	ObjectMapper objectMapper;
	HttpClient httpClient = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(10)).build();

	@Autowired
	ITtsRequestRepository ttsRequestRepository;

	@Autowired
	UploadFileService cloudinaryService;
	
	@NonFinal
	@Value("${tts.output.directory}")
	String outputDirectory;

	@NonFinal
	@Value("${server.base-url}") // Thêm base URL của server bạn, ví dụ: http://localhost:8080
	private String serverBaseUrl;

	@PostMapping("/speak")
	public ResponseEntity<?> speak(@RequestBody String text) {
		// 1. Tạo một ID duy nhất cho request này
		String requestId = UUID.randomUUID().toString();

		// 2. Tạo và lưu trạng thái ban đầu vào DB
		TtsRequest ttsJob = new TtsRequest();
		ttsJob.setRequestId(requestId);
		ttsJob.setStatus("PENDING");
		ttsJob.setCreatedAt(Instant.now());
		ttsRequestRepository.save(ttsJob);

		// 3. TẠO CALLBACK URL ĐÚNG CÚ PHÁP
		String callbackUrl = serverBaseUrl + "/api/tts/callback?requestId=" + requestId;

		// 4. Gọi service để gửi yêu cầu đến FPT.AI (chạy trong một luồng riêng)
		CompletableFuture.runAsync(() -> {
			try {
				service.sendToFptAi(text, callbackUrl);
				// Cập nhật trạng thái sau khi gửi thành công
				ttsJob.setStatus("PROCESSING");
				ttsRequestRepository.save(ttsJob);
			} catch (Exception e) {
				logger.error("Failed to send request to FPT.AI for requestId: {}", requestId, e);
				ttsJob.setStatus("FAILED");
				ttsJob.setErrorMessage("Failed to initiate TTS process.");
				ttsRequestRepository.save(ttsJob);
			}
		});

		// 5. Trả về response ngay lập tức cho client
		Map<String, String> response = Map.of("message", "Your request is being processed.", "status", "PENDING",
				"requestId", requestId, "status_check_url", "/api/tts/status/" + requestId);
		return ResponseEntity.accepted().body(response);
	}

	@PostMapping("/callback")
	public ResponseEntity<Void> handleFptCallback(@RequestBody Map<String, Object> callbackPayload,
			@RequestParam("requestId") String requestIdFromUrl) { // Đổi tên để phân biệt

		logger.info("Received callback for requestId [{}]: {}", requestIdFromUrl, callbackPayload);

		// Dùng requestId từ URL vì nó là nguồn đáng tin cậy nhất mà bạn kiểm soát
		final String requestId = requestIdFromUrl;

		TtsRequest ttsJob = ttsRequestRepository.findById(requestId).orElse(null);
		if (ttsJob == null) {
			logger.error("Received callback for an unknown requestId: {}", requestId);
			return ResponseEntity.badRequest().build();
		}

		if (!"PROCESSING".equals(ttsJob.getStatus())) {
			logger.warn("Received callback for a job that is not in PROCESSING state. Current state: {}. Ignoring.",
					ttsJob.getStatus());
			return ResponseEntity.ok().build();
		}

		// Lấy trạng thái thành công từ payload
		// Dùng Boolean.parseBoolean để xử lý an toàn hơn
		boolean success = Boolean.parseBoolean(String.valueOf(callbackPayload.get("success")));

		if (success) {
			// --- SỬA LẠI THEO ĐÚNG LOG THỰC TẾ ---
			// Lấy link từ trường 'message'
			String asyncUrl = (String) callbackPayload.get("message");
			// ------------------------------------

			if (asyncUrl == null || asyncUrl.isBlank()) {
				logger.error("Callback successful but 'message' URL is missing for requestId: {}", requestId);
				ttsJob.setStatus("FAILED");
				ttsJob.setErrorMessage("Callback successful but async URL was missing in 'message' field.");
				ttsRequestRepository.save(ttsJob);
				return ResponseEntity.badRequest().build();
			}

			// Chạy việc tải file trong một luồng riêng
			CompletableFuture.runAsync(() -> {

				try {
					// Tải file từ FPT.AI về bộ nhớ
					byte[] audioBytes = downloadFileToMemory(asyncUrl);

					if (audioBytes != null) {
						// Tạo một public ID duy nhất, ví dụ: tts_audio/tên_file_gốc
						String fileNameWithoutExt = extractFileName(asyncUrl).replace(".mp3", "");
						String publicId = "tts_audio/" + fileNameWithoutExt;

						// Upload lên Cloudinary
						String cloudinaryUrl = cloudinaryService.uploadAudio(audioBytes, publicId);

						// Lưu URL của Cloudinary vào DB
						ttsJob.setStatus("COMPLETED");
						ttsJob.setAudioFilePath(cloudinaryUrl); // Lưu URL công khai bền vững
					} else {
						// Xử lý lỗi tải file
					}
				} catch (Exception e) {
					// Xử lý lỗi upload
				}
				ttsRequestRepository.save(ttsJob);
			});

		} else { // Xử lý khi FPT báo lỗi
			String errorMessage = (String) callbackPayload.getOrDefault("message", "Unknown error from FPT.AI");
			ttsJob.setStatus("FAILED");
			ttsJob.setErrorMessage("FPT.AI Error: " + errorMessage);
			ttsRequestRepository.save(ttsJob);
		}

		return ResponseEntity.ok().build();
	}

	@GetMapping("/status/{requestId}")
	public ResponseEntity<?> getStatus(@PathVariable String requestId) {
		return ttsRequestRepository.findById(requestId).map(ttsJob -> {
			Map<String, Object> response = new HashMap<>();
			response.put("requestId", ttsJob.getRequestId());
			response.put("status", ttsJob.getStatus());

			if ("COMPLETED".equals(ttsJob.getStatus())) {
				String fileName = Paths.get(ttsJob.getAudioFilePath()).getFileName().toString();
				response.put("audio_url", "/api/tts/audio/" + fileName);
			} else if ("FAILED".equals(ttsJob.getStatus())) {
				response.put("error", ttsJob.getErrorMessage());
			}

			return ResponseEntity.ok(response);
		}).orElse(ResponseEntity.notFound().build());
	}

	@GetMapping("/audio/{fileName}")
	public ResponseEntity<Resource> getAudioFile(@PathVariable String fileName) {
		try {
			Path filePath = Paths.get(outputDirectory).resolve(fileName).normalize();
			Resource resource = new UrlResource(filePath.toUri());
			if (resource.exists() && resource.isReadable()) {
				return ResponseEntity.ok().header(HttpHeaders.CONTENT_TYPE, "audio/mpeg").body(resource);
			} else {
				return ResponseEntity.notFound().build();
			}
		} catch (Exception e) {
			return ResponseEntity.internalServerError().build();
		}
	}


	private boolean waitForFileReady(String url) throws InterruptedException {
		int maxRetries = 45; // Thử lại tối đa 10 lần
		long retryDelayMillis = 3000; // Chờ 1.5 giây giữa mỗi lần thử

		logger.info("Polling for file at URL: {}", url);
		for (int i = 0; i < maxRetries; i++) {
			try {
				HttpRequest request = HttpRequest.newBuilder().uri(URI.create(url))
						.method("HEAD", HttpRequest.BodyPublishers.noBody()) // Dùng HEAD để không tải body
						.build();

				HttpResponse<Void> response = httpClient.send(request, HttpResponse.BodyHandlers.discarding());

				if (response.statusCode() == 200) {
					logger.info("File is ready! (Status 200 OK)");
					return true;
				} else {
					logger.warn("Attempt {}/{}: File not ready yet. Status code: {}", (i + 1), maxRetries,
							response.statusCode());
				}

			} catch (IOException e) {
				logger.error("Attempt {}/{}: IOException while polling: {}", (i + 1), maxRetries, e.getMessage());
			}

			// Chờ trước khi thử lại
			Thread.sleep(retryDelayMillis);
		}
		return false; // Hết số lần thử mà file vẫn chưa sẵn sàng
	}

	private String extractFileName(String url) {
		return url.substring(url.lastIndexOf('/') + 1);
	}

	private byte[] downloadFileToMemory(String url) {
	    logger.info("Attempting to download file to memory from: {}", url);
	    try {
	        // Tạo một request GET đơn giản đến URL
	        HttpRequest request = HttpRequest.newBuilder()
	                .uri(URI.create(url))
	                .timeout(Duration.ofMinutes(2)) // Đặt timeout dài hơn cho việc tải file lớn
	                .build();

	        // Gửi request và nhận response body dưới dạng một mảng byte[]
	        HttpResponse<byte[]> response = httpClient.send(request, HttpResponse.BodyHandlers.ofByteArray());
	        
	        // Kiểm tra xem request có thành công không (status code 2xx)
	        if (response.statusCode() >= 200 && response.statusCode() < 300) {
	            logger.info("File downloaded successfully to memory. Size: {} bytes.", response.body().length);
	            return response.body();
	        } else {
	            logger.error("Failed to download file to memory from URL: {}. Status code: {}", url, response.statusCode());
	            return null; // Trả về null nếu tải thất bại
	        }
	    } catch (IOException | InterruptedException e) {
	        logger.error("Exception during in-memory file download from URL [{}]: {}", url, e.getMessage());
	        // Nếu luồng bị ngắt, hãy khôi phục lại trạng thái ngắt
	        if (e instanceof InterruptedException) {
	            Thread.currentThread().interrupt();
	        }
	        return null; // Trả về null khi có exception
	    }
	}

	private Resource getAudioResource(Path filePath) {
		try {
			return new UrlResource(filePath.toUri());
		} catch (Exception e) {
			throw new RuntimeException("Error creating resource: " + e.getMessage(), e);
		}
	}

//	@PostMapping("/speak")
//	public Map<String, Object> convert(@RequestBody String text) throws JsonMappingException, JsonProcessingException {
//		return objectMapper.readValue(service.convertTextToSpeech(text), Map.class)  ;
//	}
}
