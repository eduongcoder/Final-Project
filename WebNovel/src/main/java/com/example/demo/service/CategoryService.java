package com.example.demo.service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.stereotype.Service;

import com.example.demo.dto.request.CategoryCreationRequest;
import com.example.demo.dto.request.CategoryUpdateRequest;
import com.example.demo.dto.respone.CategoryRespone;
import com.example.demo.entity.Category;
import com.example.demo.entity.Novel;
import com.example.demo.exception.AppException;
import com.example.demo.exception.ErrorCode;
import com.example.demo.mapper.ICategoryMapper;
import com.example.demo.repository.ICategoryRepository;
import com.example.demo.repository.INovelRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class CategoryService {

	ICategoryMapper categoryMapper;
	ICategoryRepository categoryRepository;
	INovelRepository novelRepository;
	public List<CategoryRespone> getAllCategory() {
		return categoryRepository.findAll().stream().map(t -> categoryMapper.toCategoryRespone(t)).toList();
	}

	public CategoryRespone createCategory(CategoryCreationRequest request) {
		if (categoryRepository.existsByNameCategory(request.getNameCategory())) {
			throw new AppException(ErrorCode.CATEGORY_ALREADY_IN);
		}
		Category category = categoryMapper.toCategory(request);

		Set<Novel> novels = new HashSet<>(novelRepository.findAllById(request.getNovels()));
		 category= categoryRepository.save(category);

		for (Novel novel : novels) {
			novel.getCategories().add(category);
			novelRepository.save(novel);
		}
		
		return categoryMapper.toCategoryRespone(category);
	}

	public String deleteCategory(String idCategory) {
		if (!categoryRepository.existsById(idCategory)) {
			throw new AppException(ErrorCode.CATEGORY_NOT_EXISTED);
		}
		try {
			categoryRepository.deleteById(idCategory);

		} catch (Exception e) {
			throw new AppException(ErrorCode.DELETE_CONTRAINT);
		}
		return idCategory;
	}

	public CategoryRespone updateCategory(CategoryUpdateRequest request) {
		Category category=categoryMapper.toCategoryUpdate(request);
		if (!categoryRepository.existsById(request.getIdCategory())) {
			throw new AppException(ErrorCode.CATEGORY_NOT_EXISTED);
		}
		Set<Novel> novels = new HashSet<>(novelRepository.findAllById(request.getNovels()));
		 category= categoryRepository.save(category);

		for (Novel novel : novels) {
			novel.getCategories().add(category);
			novelRepository.save(novel);
		}
		
		return categoryMapper.toCategoryRespone(category);
	}
}
