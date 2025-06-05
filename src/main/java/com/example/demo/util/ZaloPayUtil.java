package com.example.demo.util;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@RequiredArgsConstructor
@Component
public class ZaloPayUtil {
    public static final String HMACSHA256 = "HmacSHA256";

    public static String HMacHexStringEncode(String algorithm, String key, String data) {
        try {
            Mac mac = Mac.getInstance(algorithm);
            SecretKeySpec secretKeySpec = new SecretKeySpec(key.getBytes(), algorithm);
            mac.init(secretKeySpec);
            byte[] hmacBytes = mac.doFinal(data.getBytes());
            StringBuilder hexString = new StringBuilder();
            for (byte b : hmacBytes) {
                hexString.append(String.format("%02x", b));
            }
            return hexString.toString();
        } catch (Exception e) {
            throw new RuntimeException("Error generating HMAC", e);
        }
    }
    public static String createMAC(String appId, String amount, String orderInfo,String trans_id, String returnUrl, String secretKey) {
        try {

            String rawString = appId + "|" + trans_id + "|" + amount + "|" + orderInfo + "|" + returnUrl;
            Mac sha256_HMAC = Mac.getInstance("HmacSHA256");
            SecretKeySpec secret_key = new SecretKeySpec(secretKey.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            sha256_HMAC.init(secret_key);
            byte[] macData = sha256_HMAC.doFinal(rawString.getBytes(StandardCharsets.UTF_8));
            return bytesToHex(macData);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
    public static String generateAppTransId(String transID) {
        // Lấy ngày hiện tại và định dạng theo mẫu YYMMDD
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyMMdd");
        String formattedDate = LocalDate.now().format(formatter);

        // Kết hợp ngày và mã giao dịch (transID) để tạo app_trans_id
        return formattedDate + "_" + transID;
    }
    private static String bytesToHex(byte[] bytes) {
        StringBuilder hexString = new StringBuilder();
        for (int i = 0; i < bytes.length; i++) {
            String hex = Integer.toHexString(0xff & bytes[i]);
            if (hex.length() == 1) hexString.append('0');
            hexString.append(hex);
        }
        return hexString.toString();
    }
}
