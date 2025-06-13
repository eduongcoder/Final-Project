package com.example.demo.service;

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

import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.experimental.NonFinal;

@Service
public class TextService {
	private final ObjectMapper objectMapper;
	private final HttpClient httpClient;

//	HttpClient httpClient = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(10)).build();

	@NonFinal
	@Value("${tts.output.directory}")
	String outputDirectory;
	private static final Logger logger = LoggerFactory.getLogger(TextService.class);

	private static final String API_KEY = "FN1fx4E5lEd5Qt5FHr0RmT5xE3GHXzuj";
	private static final String API_URL = "https://api.fpt.ai/hmi/tts/v5";

	@Autowired
	public TextService(ObjectMapper objectMapper) {
		this.objectMapper = objectMapper;
		this.httpClient = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(10)).build();
	}
	
	public void sendToFptAi(String text, String callbackUrl) {
	    try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
	        HttpPost request = new HttpPost(API_URL);
	        request.setHeader("api-key", API_KEY);
	        request.setHeader("voice", "banmai");
	        // Quan trọng: Thêm callback_url và truyền vào một body JSON
	        request.setHeader("callback_url", callbackUrl);
	        
	     // --- THAY ĐỔI QUAN TRỌNG: GỬI TEXT THÔ ---
	        // Không dùng JSON body nữa, mà dùng text thô như tài liệu
	        StringEntity entity = new StringEntity(text, "UTF-8");
	        request.setEntity(entity);

	       

	        logger.info("Sending request to FPT.AI with callback: {}", callbackUrl);
	        try (CloseableHttpResponse response = httpClient.execute(request)) {
	             String responseBody = EntityUtils.toString(response.getEntity(), "UTF-8");
	             logger.info("FPT.AI initial response: {}", responseBody);
	        }
	    } catch (Exception e) {
	        throw new RuntimeException("Error sending request to FPT.AI", e);
	    }
	}
	
	

	public String convertTextToSpeech(String text) {
		
//		int timeoutMillis = 30000; // 30 giây
//        RequestConfig config = RequestConfig.custom()
//            .setConnectTimeout(timeoutMillis)        // Timeout để thiết lập kết nối
//            .setConnectionRequestTimeout(timeoutMillis) // Timeout để lấy kết nối từ connection pool
//            .setSocketTimeout(timeoutMillis)         // Timeout chờ dữ liệu (quan trọng nhất)
//            .build();
		
		try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
			HttpPost request = new HttpPost(API_URL);
//			request.setConfig(config);
			request.setHeader("api-key", API_KEY);
			request.setHeader("voice", "banmai");
			request.setHeader("speed", "0");

			StringEntity entity = new StringEntity(text, "UTF-8");
			request.setEntity(entity);

//			logger.info("Sending TTS request to FPT.AI with a {}ms timeout...", timeoutMillis);
			try (CloseableHttpResponse response = httpClient.execute(request)) {
				int statusCode = response.getStatusLine().getStatusCode();
                String responseBody = EntityUtils.toString(response.getEntity(), "UTF-8");
                if (statusCode >= 200 && statusCode < 300) {
                    logger.info("Received successful response from FPT.AI: {}", responseBody);
                    return responseBody;
                } else {
                    logger.error("FPT.AI API returned an error. Status: {}, Body: {}", statusCode, responseBody);
                    // Trả về một JSON rỗng để không gây lỗi ObjectMapper, nhưng vẫn báo lỗi
                    return "{}"; 
                }
			}
		} catch (Exception e) {
			logger.error("Exception occurred while calling FPT.AI TTS API.", e);
			// Trả về một JSON rỗng khi có lỗi mạng hoặc timeout
            return "{}"; 
		}
	}

	public Path convert(String text)
			throws JsonMappingException, JsonProcessingException, IOException, InterruptedException {

		String fptApiResponse = convertTextToSpeech(text);

		 // KIỂM TRA PHÒNG THỦ
        if (fptApiResponse == null || fptApiResponse.trim().isEmpty() || fptApiResponse.equals("{}")) {
            logger.error("Aborting conversion because the initial response from FPT.AI was invalid.");
            return null;
        }
		
		Map<String, Object> response = objectMapper.readValue(fptApiResponse, Map.class);
		String asyncUrl = (String) response.get("async");

		if (asyncUrl == null || asyncUrl.isEmpty()) {
			logger.error("API did not return an async URL. Response: {}", fptApiResponse);
			return null; // Rõ ràng: không có URL thì trả về null
		}

		// --- PHẦN THAY ĐỔI QUAN TRỌNG ---
		// Chờ cho đến khi file sẵn sàng trước khi tải về
		if (!waitForFileReady(asyncUrl)) {
			logger.error("File was not ready at {} after multiple retries.", asyncUrl);
			return null; // Rõ ràng: chờ không được thì trả về null
		}
		// --- KẾT THÚC THAY ĐỔI ---

		// Tải file audio từ URL sau khi đã xác nhận nó tồn tại
		String fileName = extractFileName(asyncUrl);
		Path filePath = Paths.get(outputDirectory, fileName);

		boolean isDownloaded = downloadFile(asyncUrl, filePath);

		if (isDownloaded) {
			return filePath; // Rõ ràng: thành công thì trả về đối tượng Path
		} else {
			return null; // Rõ ràng: tải lỗi thì trả về null
		}
	}

	private boolean waitForFileReady(String url) throws InterruptedException {
		int maxRetries = 45; // Thử lại tối đa 45 lần
		long retryDelayMillis = 3000; // Chờ 3 giây giữa mỗi lần thử

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
}
