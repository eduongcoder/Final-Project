package com.example.demo.dto.request;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ShippingOrderRequest {
    int payment_type_id;
    String note;
    String required_note;

    String from_name;
    String from_phone;
    String from_address;
    String from_ward_name;
    String from_district_name;
    String from_province_name;

    String return_phone;
    String return_address;
    Integer return_district_id;
    String return_ward_code;

    String client_order_code;

    String to_name;
    String to_phone;
    String to_address;
    String to_ward_code;
    int to_district_id;

    int cod_amount;
    String content;

    int weight;
    int length;
    int width;
    int height;

    int insurance_value;

    int service_id;
    int service_type_id;

    String coupon;

    List<Integer> pick_shift;

    List<Item> items;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class Item {
        String name;
        String code;
        int quantity;
        int price;
        int length;
        int width;
        int height;
        int weight;
        Category category;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class Category {
        String level1;
    }
}
