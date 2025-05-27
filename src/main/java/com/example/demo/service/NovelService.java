package com.example.demo.service;

import java.io.IOException;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.dto.request.NovelAddAuthorRequest;
import com.example.demo.dto.request.NovelAddCategoryRequest;
import com.example.demo.dto.request.NovelCreatationRequest;
import com.example.demo.dto.request.NovelRemoveAuthorRequest;
import com.example.demo.dto.request.NovelRemoveCategoryRequest;
import com.example.demo.dto.request.NovelUpdateRequest;
import com.example.demo.dto.respone.NovelRespone;
import com.example.demo.dto.respone.UploadFileRespone;
import com.example.demo.entity.Author;
import com.example.demo.entity.Category;
import com.example.demo.entity.Novel;
import com.example.demo.exception.AppException;
import com.example.demo.exception.ErrorCode;
import com.example.demo.mapper.INovelMapper;
import com.example.demo.repository.IAuthorRepository;
import com.example.demo.repository.ICategoryRepository;
import com.example.demo.repository.INovelRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class NovelService {
	INovelRepository novelRepository;
	INovelMapper novelMapper;
	IAuthorRepository authorRepository;
	UploadFileService uploadFileService;
	ICategoryRepository categoryRepository;

	public List<NovelRespone> getAll() {
		return novelRepository.findAll().stream().map(t -> novelMapper.toNovelRespone(t)).toList();
	}

	public NovelRespone getNovel(String idNovel) {
		return novelMapper.toNovelRespone(novelRepository.findById(idNovel).get());
	}

	public NovelRespone createNovel(NovelCreatationRequest request, MultipartFile file) throws IOException {
		Novel novel = novelMapper.toNovel(request);
		Set<Author> authors = new HashSet<>(authorRepository.findAllById(request.getAuthors()));
		novel.setAuthors(authors);

		if (file != null && !file.isEmpty()) {
			UploadFileRespone uploadFileRespone = uploadFileService.uploadFile(file);
			novel.setImageNovel(uploadFileRespone.getUrl());
			novel.setPublicIDNovel(uploadFileRespone.getPublic_id());
		}
		return novelMapper.toNovelRespone(novelRepository.save(novel));
	}

	public NovelRespone updateNovel(NovelUpdateRequest request, MultipartFile file) throws IOException {

		Novel novel = novelMapper.toNovelUpdate(request);

		Set<Author> authors = new HashSet<>(authorRepository.findAllById(request.getAuthors()));
		novel.setAuthors(authors);

		if (file != null && !file.isEmpty()) {

			if (novel.getPublicIDNovel() != null && !novel.getPublicIDNovel().isEmpty()) {
				uploadFileService.deleteImage(novel.getPublicIDNovel());
			}

			UploadFileRespone uploadFileRespone = uploadFileService.uploadFile(file);
			novel.setImageNovel(uploadFileRespone.getUrl());
			novel.setPublicIDNovel(uploadFileRespone.getPublic_id());
		}

		return novelMapper.toNovelRespone(novelRepository.save(novel));
	}

	public String deleteById(String idNovel) {
		try {
			Novel novel = novelRepository.findById(idNovel).get();
			if (!novel.getPublicIDNovel().isEmpty()) {
				uploadFileService.deleteImage(novel.getPublicIDNovel());

			}
			novelRepository.deleteById(idNovel);
			return idNovel;
		} catch (Exception e) {
			throw new AppException(ErrorCode.DELETE_CONTRAINT);
		}

	}

	public NovelRespone removeAuthor(NovelRemoveAuthorRequest request) {
		Novel novel = novelRepository.findById(request.getIdNovel())
				.orElseThrow(() -> new AppException(ErrorCode.NOVEL_NOT_EXISTED));
		Author author = authorRepository.findById(request.getIdAuthor())
				.orElseThrow(() -> new AppException(ErrorCode.AUTHOR_NOT_EXISTED));

		if (novel.getAuthors().remove(author)) {
			novelRepository.save(novel);
		}

		return novelMapper.toNovelRespone(novel);
	}

	public NovelRespone addAuthor(NovelAddAuthorRequest request) {
		Novel novel = novelRepository.findById(request.getIdNovel())
				.orElseThrow(() -> new AppException(ErrorCode.NOVEL_NOT_EXISTED));
		Author author = authorRepository.findById(request.getIdAuthor())
				.orElseThrow(() -> new AppException(ErrorCode.AUTHOR_NOT_EXISTED));

		if (novel.getAuthors().add(author)) {
			novelRepository.save(novel);
		}

		return novelMapper.toNovelRespone(novel);
	}

	public NovelRespone removeCategory(NovelRemoveCategoryRequest request) {
		Novel novel = novelRepository.findById(request.getIdNovel())
				.orElseThrow(() -> new AppException(ErrorCode.NOVEL_NOT_EXISTED));
		Category category = categoryRepository.findById(request.getIdCategory())
				.orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_EXISTED));

		if (novel.getCategories().remove(category)) {
			novelRepository.save(novel);
		}

		return novelMapper.toNovelRespone(novel);
	}

	public NovelRespone addCategory(NovelAddCategoryRequest request) {
		Novel novel = novelRepository.findById(request.getIdNovel())
				.orElseThrow(() -> new AppException(ErrorCode.NOVEL_NOT_EXISTED));
		Category category = categoryRepository.findById(request.getIdCategory())
				.orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_EXISTED));

		if (novel.getCategories().add(category)) {
			novelRepository.save(novel);
		}

		return novelMapper.toNovelRespone(novel);
	}

}
