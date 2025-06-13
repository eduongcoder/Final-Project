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
	    Map<String, String> response = Map.of(
	        "message", "Your request is being processed.", 
	        "status", "PENDING",
	        "requestId", requestId, 
	        "status_check_url", "/api/tts/status/" + requestId
	    );
	    return ResponseEntity.accepted().body(response);
	}

	@PostMapping("/callback")
	public ResponseEntity<Void> handleFptCallback(
	        @RequestBody Map<String, Object> callbackPayload, 
	        @RequestParam("requestId") String requestId) { 

	    logger.info("Received callback for requestId [{}]: {}", requestId, callbackPayload);

	    // Bạn có thể bỏ kiểm tra requestId == null vì @RequestParam mặc định là required,
	    // nếu thiếu nó sẽ không vào được controller.
	    
	    TtsRequest ttsJob = ttsRequestRepository.findById(requestId).orElse(null);
	    if (ttsJob == null) {
	        logger.error("Received callback for an unknown requestId: {}", requestId);
	        return ResponseEntity.badRequest().build();
	    }
	    
	    // Kiểm tra trạng thái của job để tránh xử lý lại một job đã hoàn thành hoặc thất bại
	    if (!"PROCESSING".equals(ttsJob.getStatus())) {
	        logger.warn("Received callback for a job that is not in PROCESSING state. Current state: {}. Ignoring.", ttsJob.getStatus());
	        return ResponseEntity.ok().build(); // Vẫn trả về 200 OK để FPT không retry
	    }

	    // --- PHẦN THAY ĐỔI CHÍNH ---
	    // Dựa trên log thực tế, 'error'=0 là thành công.
	    Integer errorCode = (Integer) callbackPayload.getOrDefault("error", -1);
	    
	    if (errorCode == 0) {
	        // Lấy link từ trường 'async'
	        String asyncUrl = (String) callbackPayload.get("async");

	        if (asyncUrl == null || asyncUrl.isBlank()) {
	            logger.error("Callback successful (error=0) but 'async' URL is missing for requestId: {}", requestId);
	            ttsJob.setStatus("FAILED");
	            ttsJob.setErrorMessage("Callback successful but async URL was missing.");
	            ttsRequestRepository.save(ttsJob);
	            return ResponseEntity.badRequest().build();
	        }
	        
	        // Chạy việc tải file trong một luồng riêng
	        CompletableFuture.runAsync(() -> {
	            try {
	                String fileName = extractFileName(asyncUrl);
	                Path filePath = Paths.get(outputDirectory, fileName);
	                boolean downloaded = downloadFile(asyncUrl, filePath);

	                if (downloaded) {
	                    ttsJob.setStatus("COMPLETED");
	                    ttsJob.setAudioFilePath(filePath.toString());
	                } else {
	                    ttsJob.setStatus("FAILED");
	                    ttsJob.setErrorMessage("Failed to download the audio file from async URL.");
	                }
	            } catch (Exception e) {
	                logger.error("Exception during file download in callback for requestId: {}", requestId, e);
	                ttsJob.setStatus("FAILED");
	                ttsJob.setErrorMessage("Exception during file download: " + e.getMessage());
	            }
	            ttsRequestRepository.save(ttsJob);
	        });

	    } else { // Xử lý khi FPT báo lỗi
	        String errorMessage = (String) callbackPayload.getOrDefault("message", "Unknown error from FPT.AI");
	        ttsJob.setStatus("FAILED");
	        ttsJob.setErrorMessage("FPT.AI Error Code: " + errorCode + " - " + errorMessage);
	        ttsRequestRepository.save(ttsJob);
	    }

	    return ResponseEntity.ok().build();
	}
	
	@GetMapping("/status/{requestId}")
	public ResponseEntity<?> getStatus(@PathVariable String requestId) {
	    return ttsRequestRepository.findById(requestId)
	            .map(ttsJob -> {
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
	            })
	            .orElse(ResponseEntity.notFound().build());
	}
	
	@GetMapping("/audio/{fileName}")
	public ResponseEntity<Resource> getAudioFile(@PathVariable String fileName) {
	     try {
	        Path filePath = Paths.get(outputDirectory).resolve(fileName).normalize();
	        Resource resource = new UrlResource(filePath.toUri());
	        if (resource.exists() && resource.isReadable()) {
	            return ResponseEntity.ok()
	                    .header(HttpHeaders.CONTENT_TYPE, "audio/mpeg")
	                    .body(resource);
	        } else {
	            return ResponseEntity.notFound().build();
	        }
	    } catch (Exception e) {
	        return ResponseEntity.internalServerError().build();
	    }
	}
	
//	@PostMapping("/speak")
//	public ResponseEntity<?> convert(@RequestBody String text)
//			throws JsonMappingException, JsonProcessingException, IOException, InterruptedException {
//
//		Map<String, Object> response = objectMapper.readValue(service.convertTextToSpeech(text), Map.class);
//		String asyncUrl = (String) response.get("async");
//
//		if (asyncUrl == null || asyncUrl.isEmpty()) {
//			logger.error("API did not return an async URL. Response: {}", response);
//			return new ResponseEntity<>("Failed to get async URL from TTS service.", HttpStatus.INTERNAL_SERVER_ERROR);
//		}
//
//		// --- PHẦN THAY ĐỔI QUAN TRỌNG ---
//		// Chờ cho đến khi file sẵn sàng trước khi tải về
//		boolean isFileReady = waitForFileReady(asyncUrl);
//
//		if (!isFileReady) {
//			logger.error("File was not ready at {} after multiple retries.", asyncUrl);
//			return new ResponseEntity<>("File was not available for download.", HttpStatus.GATEWAY_TIMEOUT);
//		}
//		// --- KẾT THÚC THAY ĐỔI ---
//
//		// Tải file audio từ URL sau khi đã xác nhận nó tồn tại
//		String fileName = extractFileName(asyncUrl);
//		Path filePath = Paths.get(outputDirectory, fileName);
//
//		boolean downloaded = downloadFile(asyncUrl, filePath);
//
//		if (!downloaded) {
//			return new ResponseEntity<>("Failed to download the file.", HttpStatus.INTERNAL_SERVER_ERROR);
//		}
//
//		// Trả về file resource để client có thể truy cập
//		Resource resource = getAudioResource(filePath);
//		if (resource.exists() && resource.isReadable()) {
//			response.put("local_url", "/api/tts/audio/" + fileName); // Trả về một URL cục bộ để client truy cập
//			response.put("status", "success");
//			return new ResponseEntity<>(response, HttpStatus.OK);
//		} else {
//			return new ResponseEntity<>("Could not read the downloaded file.", HttpStatus.INTERNAL_SERVER_ERROR);
//		}
//	}

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

	private boolean downloadFile(String url, Path filePath) {
		try {
			HttpRequest request = HttpRequest.newBuilder().uri(URI.create(url)).build();

			HttpResponse<byte[]> response = httpClient.send(request, HttpResponse.BodyHandlers.ofByteArray());
			if (response.statusCode() == 200) {
				Files.createDirectories(filePath.getParent()); // Đảm bảo thư mục tồn tại
				Files.write(filePath, response.body());
				logger.info("File downloaded successfully to: {}", filePath);
				return true;
			} else {
				logger.error("Failed to download file from URL: {}, status code: {}", url, response.statusCode());
				return false;
			}
		} catch (IOException | InterruptedException e) {
			logger.error("Exception during file download: {}", e.getMessage());
			Thread.currentThread().interrupt(); // Restore the interrupted status
			return false;
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
