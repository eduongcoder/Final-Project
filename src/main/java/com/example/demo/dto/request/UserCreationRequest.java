package com.example.demo.dto.request;

import java.time.LocalDateTime;
import java.util.Set;

import com.example.demo.enums.Status;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserCreationRequest {
	String passwordUser;

	String emailUser;

	LocalDateTime dobUser;

	Integer coin;
}
