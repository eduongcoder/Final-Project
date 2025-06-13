package com.example.demo.entity;

import java.time.LocalDateTime;
import java.util.List;

import com.example.demo.enums.Role;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
public class Comment {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	Integer idComment;
    
	@Column(name = "content_comment", length = 1024, nullable = false, columnDefinition = "NVARCHAR(1024)")
	String contentComment;

	Integer likeComment;

	Integer dislikeComment;
	
	@ManyToOne
	@JoinColumn(name = "idUser",nullable = false)
	User user;
	
	@ManyToOne
	@JoinColumn(name = "idChapter",nullable = false)
	Chapter chapter;
}
