package com.example.demo.entity;

import java.util.HashSet;
import java.util.Set;

import com.example.demo.enums.Status;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Novel {

	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	String idNovel;
	String publicIDNovel;
	String nameNovel;
	String descriptionNovel;
	Integer totalChapter;
	@Column(name = "rating", length = 6)
	String rating;
	@Enumerated(EnumType.STRING)
	Status statusNovel;
	String imageNovel;

	@ManyToMany
	Set<Author> authors = new HashSet<>();
	
	@ManyToMany
	Set<Category> categories = new HashSet<>();
	
	@OneToMany(mappedBy = "novel",cascade = CascadeType.ALL)
	Set<Chapter> chapters=new HashSet<>();
}
