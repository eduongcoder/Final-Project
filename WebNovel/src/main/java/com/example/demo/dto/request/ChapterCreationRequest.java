package com.example.demo.dto.request;

import java.time.LocalDate;
import java.util.Set;

import com.example.demo.entity.Novel;
import com.example.demo.enums.Gender;

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
public class ChapterCreationRequest {

	String titleChapter;

	String contentChapter;


	Integer viewChapter;

	String novel;
}
