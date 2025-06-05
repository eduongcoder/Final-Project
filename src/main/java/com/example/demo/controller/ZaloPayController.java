package com.example.demo.controller;

import com.example.demo.dto.request.ShippingOrderRequest;
import com.example.demo.dto.request.ZaloPayCallback;
import com.example.demo.dto.request.ZaloPayRequest;
import com.example.demo.dto.request.ZaloPayWrapperRequest;
import com.example.demo.dto.respone.ZaloPayResponseData;
import com.example.demo.service.ZaloPayService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ZaloPayController {
	ZaloPayService zaloPayService;
	ObjectMapper objectMapper;
//	Shipping shipping;

	@PostMapping("/create")
	public String createPaymentOrder(@RequestBody ZaloPayRequest request)
			throws JsonProcessingException, UnsupportedEncodingException {

//		ResponseEntity<?> order=shipping.createOrder(request.getShippingOrderRequest());

//		Map<String, Object> body=(Map<String, Object>) order.getBody();

//		String orderId=body.get("orderCode").toString();

		ResponseEntity<?> responseEntity = zaloPayService.createPaymentOrderupdate(request);

		JsonNode rootNode = objectMapper.readTree(responseEntity.getBody().toString());

		String responseDataString = rootNode.get("response_data").asText();

		ZaloPayResponseData responseData = objectMapper.readValue(responseDataString, ZaloPayResponseData.class);

		System.out.println("Mã giao dịch: " + responseData.getZp_trans_token());
		System.out.println("Link thanh toán: " + responseData.getOrder_url());

		return responseData.getOrder_url();
	}

	// @RequestBody String body
//	@PostMapping("/call")
//	public void call() {
	// try {
	// JsonNode callbackJson = objectMapper.readTree(body);
	// String embedDataStr = callbackJson.get("embed_data").asText();
	//
	// JsonNode embedData = objectMapper.readTree(embedDataStr);
	// JsonNode shippingOrderNode = embedData.get("shipping_order");
	//
	// // Deserialize thành ShippingOrderRequest
	// ShippingOrderRequest request = objectMapper.treeToValue(shippingOrderNode,
	// ShippingOrderRequest.class);
	//
	// // Gửi request sang GHN
	// ResponseEntity<?> ghnResponse = shipping.createOrder(request);
	// log.info("tao roi ne hehe");
	// return ResponseEntity.ok("Đã tạo đơn GHN thành công: " +
	// ghnResponse.getBody());
	//
	// } catch (Exception e) {
	// e.printStackTrace();
	// return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi
	// callback: " + e.getMessage());
	// }
//		zaloPayService.checkCallback();
//	}
	// @RequestParam("embed_data") String embedDataStr
	// @GetMapping("/callback")
	// public ResponseEntity<?> handleCallback(@RequestParam("shipping_order")
	// String shippingOrderStr) {
	// try {
	// String decoded = URLDecoder.decode(shippingOrderStr, StandardCharsets.UTF_8);
	// ShippingOrderRequest request = objectMapper.readValue(decoded,
	// ShippingOrderRequest.class);
	// log.info(request.toString());
	// // Gửi sang GHN
	// ResponseEntity<?> ghnRes = shipping.createOrder(request);
	// return ResponseEntity.ok("Tạo đơn GHN thành công: " + ghnRes.getBody());
	// } catch (Exception e) {
	// e.printStackTrace();
	// return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Lỗi: " +
	// e.getMessage());
	// }
	// }

	@GetMapping("/callback")
	public void handleCallback() {

	}
}
