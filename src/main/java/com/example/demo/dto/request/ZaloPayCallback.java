package com.example.demo.dto.request;

import org.springframework.cloud.client.loadbalancer.RequestData;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ZaloPayCallback {
	 private RequestData request_data;
	 private String response_data; 
}
