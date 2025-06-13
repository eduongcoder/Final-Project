package com.example.demo.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.example.demo.enums.Role;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
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
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Chapter {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	Integer idChapter;

	@Column(name = "title_chapter", length = 100)
	String titleChapter;

	@Lob
	@Column(name = "content_chapter", columnDefinition = "TEXT")
	String contentChapter;

	Integer viewChapter;

	@Lob
	@Column(name = "audio_file", columnDefinition = "MEDIUMBLOB")
	byte[] audioFile;

	@ManyToOne
	@JoinColumn(name = "id_Novel", nullable = false)
	Novel novel;
	
	@OneToMany(mappedBy = "chapter",cascade = CascadeType.ALL,orphanRemoval = true)
	List<Comment> comments=new ArrayList<>();
}
