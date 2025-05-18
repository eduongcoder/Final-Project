package com.example.demo.dto.respone;

import java.util.Set;

import com.example.demo.entity.Author;
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
public class NovelRespone {
	String idNovel;
	String publicIDNovel;
	String nameNovel;
	String descriptionNovel;
	Integer totalChapter;
	String rating;
	String statusNovel;
	String imageNovel;
  
	Set<String> authors ;
}
