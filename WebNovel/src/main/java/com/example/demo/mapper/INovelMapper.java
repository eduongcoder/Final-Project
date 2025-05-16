package com.example.demo.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.example.demo.dto.request.NovelCreatationRequest;
import com.example.demo.dto.request.NovelUpdateRequest;
import com.example.demo.dto.respone.NovelRespone;
import com.example.demo.entity.Novel;

@Mapper(componentModel = "spring")
public interface INovelMapper {
	@Mapping(target = "authors", ignore = true)
	Novel toNovel(NovelCreatationRequest request);

	@Mapping(target = "authors", ignore = true)
	Novel toNovelUpdate(NovelUpdateRequest request);
	
	@Mapping(target = "authors", ignore = true)
	NovelRespone toNovelRespone(Novel novel);
}
