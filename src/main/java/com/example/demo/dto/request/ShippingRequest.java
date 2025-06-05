package com.example.demo.dto.request;

import java.util.List;

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
public class ShippingRequest {
	private int from_district_id;
	private String from_ward_code;
	private int service_id;
	private int service_type_id;
	private int to_district_id;
	private String to_ward_code;
	private int height;
	private int length;
	private int weight;
	private int width;
	private int insurance_value;
	private int cod_failed_amount;
	private String coupon;
	private List<Item> items;
}
