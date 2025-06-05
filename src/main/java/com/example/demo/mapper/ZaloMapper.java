package com.example.demo.mapper;

import org.mapstruct.Mapper;
import org.springframework.http.ResponseEntity;

import com.example.demo.dto.request.ZaloPayCallback;

@Mapper(componentModel = "spring")
public interface ZaloMapper {

	ZaloPayCallback toZaloPayCallback(ResponseEntity<?> response);
}
