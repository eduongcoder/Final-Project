package com.example.demo.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.example.demo.dto.request.CommentCreationRequest;
import com.example.demo.dto.request.CommentUpdateRequest;
import com.example.demo.dto.respone.CommentNovelRespone;
import com.example.demo.dto.respone.CommentRespone;
import com.example.demo.entity.Comment;

@Mapper(componentModel = "spring")
public interface ICommentMapper {

	@Mapping(target = "user", ignore = true)
	@Mapping(target = "chapter", ignore = true)
	Comment toComment(CommentCreationRequest request);

	@Mapping(target = "chapter", ignore = true)
	@Mapping(target = "user", ignore = true)
	Comment toCommentUpdate(CommentUpdateRequest request);

	@Mapping(source = "user.userNameUser", target = "userName")
	CommentRespone toCommentRespone(Comment comment);
	
	@Mapping(target = "titleChapter", source = "chapter.titleChapter")
	@Mapping(source = "user.userNameUser", target = "userName")
	CommentNovelRespone toCommentNovelRespone(Comment comment);
}
