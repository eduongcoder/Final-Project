package com.example.demo.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import com.example.demo.enums.Status;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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
public class User {
	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	String idUser;

	String userNameUser;

	String passwordUser;

	String emailUser;

	String avatarUser;

	LocalDateTime dobUser;

	String publicIdAvartarUser;

	Integer coin;
	
	@OneToMany(mappedBy = "user",cascade = CascadeType.ALL,orphanRemoval = true)
	List<Comment> comments=new ArrayList<>();
}
