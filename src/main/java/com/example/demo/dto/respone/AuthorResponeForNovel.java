package com.example.demo.dto.respone;

import java.time.LocalDate;

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
public class AuthorResponeForNovel {
	String idAuthor;

	String publicIDAuthor;
	String nameAuthor;
	String descriptionAuthor;
	String nationalityAuthor;
	LocalDate dobAuthor;
	LocalDate dodAuthor;
	String genderAuthor;
	String imageAuthor;

}
