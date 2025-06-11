package com.example.demo.dto.respone;


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
public class NovelResponeForAuthor {
	String idNovel;
	String publicIDNovel;
	String nameNovel;
	String descriptionNovel;
	Integer totalChapter;
	String rating;
	String statusNovel;
	String imageNovel;
}
