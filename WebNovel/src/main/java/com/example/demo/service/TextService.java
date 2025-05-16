package com.example.demo.service;

import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.springframework.stereotype.Service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
public class TextService {
	private static final String API_KEY = "FN1fx4E5lEd5Qt5FHr0RmT5xE3GHXzuj";
    private static final String API_URL = "https://api.fpt.ai/hmi/tts/v5";

	public String convertTextToSpeech(String text) {
		try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
			HttpPost request = new HttpPost(API_URL);
			request.setHeader("api-key", API_KEY);
			request.setHeader("voice", "banmai");
			request.setHeader("speed", "");

			StringEntity entity = new StringEntity(text, "UTF-8");
			request.setEntity(entity);

			try (CloseableHttpResponse response = httpClient.execute(request)) {
				return EntityUtils.toString(response.getEntity(), "UTF-8");
			}
		} catch (Exception e) {
			e.printStackTrace();
			return "Error calling TTS API: " + e.getMessage();
		}
	}
}
