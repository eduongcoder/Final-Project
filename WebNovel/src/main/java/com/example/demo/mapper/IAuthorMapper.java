package com.example.demo.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.example.demo.dto.request.AuthorCreationRequest;
import com.example.demo.dto.request.AuthorUpdateRequest;
import com.example.demo.dto.respone.AuthorRespone;
import com.example.demo.entity.Author;

@Mapper(componentModel = "spring")
public interface IAuthorMapper {
	Author toAuthor(AuthorCreationRequest request);
	
	Author toAuthorUpdate(AuthorUpdateRequest request);
	AuthorRespone toAuthorRespone(Author author);
}
