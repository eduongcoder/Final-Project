package com.example.demo.dto.request;

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
public class CommentUpdateRequest {

	String idComment;
    
	String contentComment;

	Integer likeComment;

	Integer dislikeComment;
	
	String user;

}
