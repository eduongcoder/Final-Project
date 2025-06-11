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
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.demo.service.TextService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

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

	@NonFinal
	@Value("${tts.output.directory}")
	String outputDirectory;

	@PostMapping("/speak")
	public ResponseEntity<?> convert(@RequestBody String text)
			throws JsonMappingException, JsonProcessingException, IOException, InterruptedException {

		Map<String, Object> response = objectMapper.readValue(service.convertTextToSpeech(text), Map.class);
		String asyncUrl = (String) response.get("async");

		if (asyncUrl == null || asyncUrl.isEmpty()) {
			logger.error("API did not return an async URL. Response: {}", response);
			return new ResponseEntity<>("Failed to get async URL from TTS service.", HttpStatus.INTERNAL_SERVER_ERROR);
		}

		// --- PHẦN THAY ĐỔI QUAN TRỌNG ---
		// Chờ cho đến khi file sẵn sàng trước khi tải về
		boolean isFileReady = waitForFileReady(asyncUrl);

		if (!isFileReady) {
			logger.error("File was not ready at {} after multiple retries.", asyncUrl);
			return new ResponseEntity<>("File was not available for download.", HttpStatus.GATEWAY_TIMEOUT);
		}
		// --- KẾT THÚC THAY ĐỔI ---

		// Tải file audio từ URL sau khi đã xác nhận nó tồn tại
		String fileName = extractFileName(asyncUrl);
		Path filePath = Paths.get(outputDirectory, fileName);

		boolean downloaded = downloadFile(asyncUrl, filePath);

		if (!downloaded) {
			return new ResponseEntity<>("Failed to download the file.", HttpStatus.INTERNAL_SERVER_ERROR);
		}

		// Trả về file resource để client có thể truy cập
		Resource resource = getAudioResource(filePath);
		if (resource.exists() && resource.isReadable()) {
			response.put("local_url", "/api/tts/audio/" + fileName); // Trả về một URL cục bộ để client truy cập
			response.put("status", "success");
			return new ResponseEntity<>(response, HttpStatus.OK);
		} else {
			return new ResponseEntity<>("Could not read the downloaded file.", HttpStatus.INTERNAL_SERVER_ERROR);
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
