package com.example.demo.service;

import com.example.demo.dto.request.ShippingOrderRequest;
import com.example.demo.dto.request.ZaloPayCallback;
import com.example.demo.dto.request.ZaloPayRequest;
import com.example.demo.mapper.ZaloMapper;
import com.example.demo.repository.http.ZaloPayClient;
import com.example.demo.util.ZaloPayUtil;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.http.NameValuePair;
import org.apache.http.message.BasicNameValuePair;
import org.cloudinary.json.JSONArray;
import org.cloudinary.json.JSONObject;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.client.RestTemplate;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ZaloPayService {
	ZaloMapper zaloMapper;
    ObjectMapper objectMapper;

    String ZALO_PAY_API_URL = "https://zlpdev-mi-zlpdemo.zalopay.vn/zlp-demo/v2/api/gateway";
    String APP_ID = "2553";
    String APP_KEY = "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL";
    String ZALO_PAY_SECRET_KEY = "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz";
    ZaloPayUtil zaloPayUtil;
    String key1 = "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL";
    String key2 = "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz";

    ZaloPayClient zaloPayClient;
    public String getCurrentTimeString(String format) {
        Calendar cal = new GregorianCalendar(TimeZone.getTimeZone("GMT+7"));
        SimpleDateFormat fmt = new SimpleDateFormat(format);
        fmt.setCalendar(cal);
        return fmt.format(cal.getTimeInMillis());
    }
    public void checkCallback(){
        log.info("heheheheh");
    }
    public void checkCallbackGet(){
        log.info("hihihihi");
    }
//    ,String orderId
    public ResponseEntity<?> createPaymentOrderupdate(ZaloPayRequest user) throws JsonProcessingException{
        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/x-www-form-urlencoded");


//         String redirectUrl = "https://nhom11sangt4ca1user.netlify.app/?order_id="+orderId;
        // Tạo embed_data JSON
        JSONObject embedData = new JSONObject();
//        embedData.put("redirecturl", redirectUrl); // User redirect sau khi thanh toán
//        embedData.put("callbackurl", "http://localhost:8080/api/payment/call"); // ZaloPay gửi POST xác nhận đơn hàng
//        embedData.put("redirecturl", redirectUrl); // User redirect sau khi thanh toán
//        embedData.put("callbackurl", "https://nhom11t4sangca1.onrender.com/api/payment/call"); // ZaloPay gửi POST xác nhận đơn hàng
        embedData.put("promotioninfo", "");
        embedData.put("merchantinfo", "embeddata123");
//        embedData.put("shipping_order", new JSONObject(shippingOrderJson));
      
        String embedDataStr = embedData.toString();

        
        MultiValueMap<String, String> map = new LinkedMultiValueMap<>();
        map.add("app_id", "2553");
        map.add("key1", key1);
        map.add("key2", key2);
        map.add("amount", user.getAmount());
        map.add("app_user", "demo");
        map.add("embed_data", embedDataStr);
        map.add("item", "[{\"itemid\":\"knb\",\"itemname\":\"kim nguyen bao\",\"itemprice\":198400,\"itemquantity\":1}]");
        map.add("description", "Demo - Thanh toan don hang #ORDERID");
        map.add("more_param", "currency=VND&phone=0925226173");
        map.add("bankcode", "zalopayapp");
        String randum=String.valueOf(Math.random()*1000000000);
        StringBuilder builder=new StringBuilder();
        builder.append("250411");
        builder.append("_");
        builder.append(randum);
        String data = "app_id=" + "2553" + "&app_trans_id=" +builder.toString() + "&...";  // Include other parameters here

// Generate MAC
        String mac = zaloPayUtil.HMacHexStringEncode(zaloPayUtil.HMACSHA256, "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL", data);
        map.add("mac", mac);

        HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(map, headers);

        
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<?> response = restTemplate.exchange(
                "https://zlpdev-mi-zlpdemo.zalopay.vn/zlp-demo/v2/api/gateway",
                HttpMethod.POST,
                entity,
                String.class
        );
        

        
        return response;
    }

//    public String createPaymentOrder(@RequestBody ZaloPayRequest request) throws JsonProcessingException {
//    	ResponseEntity<?> responseEntity =createPaymentOrderupdate(request);
//
//        JsonNode rootNode = objectMapper.readTree(responseEntity.getBody().toString());
//
//        String responseDataString = rootNode.get("response_data").asText();
//
//        ZaloPayResponseData responseData = objectMapper.readValue(responseDataString, ZaloPayResponseData.class);
//
//        System.out.println("Mã giao dịch: " + responseData.getZp_trans_token());
//        System.out.println("Link thanh toán: " + responseData.getOrder_url());
//
//
//        return responseData.getOrder_url();
//    }

}
