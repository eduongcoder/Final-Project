package com.example.demo.dto.respone;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserRespone {
	String idUser;

	String userNameUser;

	String passwordUser;

	String emailUser;

	String avatarUser;

	String token;
	
	LocalDateTime dobUser;

	String publicIdAvartarUser;

	Integer coin;
	
	List<CommentRespone> commentRespones;
	List<HistoryReadRespone> historyRead;

}
