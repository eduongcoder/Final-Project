package com.example.demo.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.example.demo.enums.Gender;
import com.example.demo.enums.Role;
import com.example.demo.enums.Status;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Entity
@Builder
@Table(name = "author")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Author {
	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	String idAuthor;

	String publicIDAuthor;
	String nameAuthor;
	String descriptionAuthor; 
	String nationalityAuthor;
	LocalDate dobAuthor;
	LocalDate dodAuthor; 
	@Enumerated(EnumType.STRING)
	Gender genderAuthor;
	String imageAuthor;
 
	@ManyToMany(mappedBy = "authors")
	private Set<Novel> novels=new HashSet<>();
}
