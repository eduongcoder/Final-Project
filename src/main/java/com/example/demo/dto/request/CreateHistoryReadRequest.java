package com.example.demo.dto.request;

import java.time.LocalDateTime;


import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CreateHistoryReadRequest {

	String idNovel;
	String email;
	String idChapter;

	Integer readPlace;

	String titleChapter;

}
