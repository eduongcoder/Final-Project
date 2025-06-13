package com.example.demo.entity;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.example.demo.enums.Role;
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
@Table(name = "novel")
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
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
	@JoinTable(
			name = "novel_author",
			joinColumns = @JoinColumn(name = "novel_id"),
			inverseJoinColumns = @JoinColumn(name = "author_id"))
	Set<Author> authors = new HashSet<>();
	
	@ManyToMany
	@JoinTable(
			name = "novel_category",
			joinColumns = @JoinColumn(name = "novel_id"),
			inverseJoinColumns = @JoinColumn(name = "category_id"))
	Set<Category> categories = new HashSet<>();
	
	@OneToMany(mappedBy = "novel",cascade = CascadeType.ALL,orphanRemoval = true)
	Set<Chapter> chapters=new HashSet<>();
}
