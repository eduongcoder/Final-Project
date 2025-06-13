package com.example.demo.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.example.demo.dto.request.AuthorCreationRequest;
import com.example.demo.dto.request.AuthorUpdateRequest;
import com.example.demo.dto.respone.AuthorRespone;
import com.example.demo.entity.Author;

@Mapper(componentModel = "spring")
public interface IAuthorMapper {
	@Mapping(target = "novels", ignore = true)
	Author toAuthor(AuthorCreationRequest request);

	@Mapping(target = "novels", ignore = true)
	Author toAuthorUpdate(AuthorUpdateRequest request);

//	@Mapping(target = "novels", ignore = true) // Báo MapStruct đừng đụng đến trường này
	AuthorRespone toAuthorRespone(Author author);
}
