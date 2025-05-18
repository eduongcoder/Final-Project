package com.example.demo.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.example.demo.dto.request.CategoryCreationRequest;
import com.example.demo.dto.request.CategoryUpdateRequest;
import com.example.demo.dto.respone.CategoryRespone;
import com.example.demo.entity.Category;

@Mapper(componentModel = "spring")
public interface ICategoryMapper {
	
	@Mapping(target = "idCategory",ignore = true)
	Category toCategory(CategoryCreationRequest request);
	Category toCategoryUpdate(CategoryUpdateRequest request);
	CategoryRespone toCategoryRespone(Category chapter);  
} 
