package com.example.demo.repository.http;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Map;

@Component
@FeignClient(name = "zaloPayClient", url = "https://sb-openapi.zalopay.vn/v2/create")
public interface ZaloPayClient {

    @RequestMapping(method = RequestMethod.POST, consumes = "application/x-www-form-urlencoded")
    String createPaymentOrder(@RequestParam Map<String, String> order);
}
