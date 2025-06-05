package com.example.demo.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ZaloPayWrapperRequest {
	ZaloPayRequest zaloPayRequest;
    ShippingOrderRequest shippingOrderRequest;
}
