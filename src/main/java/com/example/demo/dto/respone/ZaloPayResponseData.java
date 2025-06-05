package com.example.demo.dto.respone;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@NoArgsConstructor
@AllArgsConstructor
public class ZaloPayResponseData {
	private int return_code;
    private String return_message;
    private int sub_return_code;
    private String sub_return_message;
    private String zp_trans_token;
    private String order_url;
    private String cashier_order_url;
    private String order_token;
    private String qr_code;

}
