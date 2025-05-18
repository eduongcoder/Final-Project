package com.example.demo.dto.request;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

import com.example.demo.entity.Author;
import com.example.demo.entity.Novel;
import com.example.demo.enums.Gender;

import jakarta.persistence.ManyToMany;
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
public class AuthorCreationRequest {

	String nameAuthor;
	String descriptionAuthor; 
	String nationalityAuthor;
	LocalDate dobAuthor;
	LocalDate dodAuthor;
	Gender genderAuthor;
	String imageAuthor;
 
	Set<String> novels ;
}
 