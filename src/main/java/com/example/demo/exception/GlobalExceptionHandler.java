package com.example.demo.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.example.demo.dto.respone.ApiRespone;

import lombok.extern.slf4j.Slf4j;

@ControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

	@ExceptionHandler(value = Exception.class)
	ResponseEntity<ApiRespone> handlingRunTimeException(RuntimeException exception){
		ApiRespone apiRespone=ApiRespone.builder().build();
		
		apiRespone.setCode(ErrorCode.UNKNOW_ERROR.getCode());
		apiRespone.setMessage(ErrorCode.UNKNOW_ERROR.getMessage());
		log.info(exception.toString());
		return ResponseEntity.badRequest().body(apiRespone);
	}
	
	@ExceptionHandler(value = AppException.class)
	ResponseEntity<ApiRespone> handlingAppException(AppException exception){
		ErrorCode errorCode= exception.getErrorcode();
		ApiRespone apiRespone=ApiRespone.builder().build();
		
		apiRespone.setCode(errorCode.getCode());
		apiRespone.setMessage(errorCode.getMessage());
		
		return ResponseEntity.badRequest().body(apiRespone);
	}
	
}
