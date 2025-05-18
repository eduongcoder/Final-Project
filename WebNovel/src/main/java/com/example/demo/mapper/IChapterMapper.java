package com.example.demo.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.example.demo.dto.request.CategoryCreationRequest;
import com.example.demo.dto.request.CategoryUpdateRequest;
import com.example.demo.dto.request.ChapterCreationRequest;
import com.example.demo.dto.request.ChapterUpdateRequest;
import com.example.demo.dto.respone.CategoryRespone;
import com.example.demo.dto.respone.ChapterRespone;
import com.example.demo.entity.Category;
import com.example.demo.entity.Chapter;

@Mapper(componentModel = "spring")
public interface IChapterMapper {

	@Mapping(target = "novel", ignore = true)
	Chapter toChapter(ChapterCreationRequest request);

	@Mapping(target = "novel", ignore = true)
	Chapter toChapterUpdate(ChapterUpdateRequest request);

	@Mapping(source = "novel.idNovel", target = "novel")
	ChapterRespone toChapterRespone(Chapter chapter);
	
	
	Chapter toChapterbyChapter(Chapter chapter);
}
