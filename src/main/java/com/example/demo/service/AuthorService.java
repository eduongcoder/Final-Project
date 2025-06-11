package com.example.demo.service;

import java.io.IOException;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.dto.request.AuthorCreationRequest;
import com.example.demo.dto.request.AuthorUpdateRequest;
import com.example.demo.dto.respone.AuthorRespone;
import com.example.demo.dto.respone.NovelRespone;
import com.example.demo.dto.respone.NovelResponeForAuthor;
import com.example.demo.dto.respone.UploadFileRespone;
import com.example.demo.entity.Author;
import com.example.demo.entity.Novel;
import com.example.demo.exception.AppException;
import com.example.demo.exception.ErrorCode;
import com.example.demo.mapper.IAuthorMapper;
import com.example.demo.mapper.INovelMapper;
import com.example.demo.repository.IAuthorRepository;
import com.example.demo.repository.INovelRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class AuthorService {
	INovelRepository novelRepository;
	IAuthorMapper authorMapper;
	IAuthorRepository authorRepository;
	UploadFileService uploadFileService;
	INovelMapper novelMapper;

	public List<AuthorRespone> getAll() {
	    List<Author> authors = authorRepository.findAll();

	    return authors.stream().map(author -> {
	        AuthorRespone authorResponse = authorMapper.toAuthorRespone(author);

	        Set<Novel> novels = authorRepository.getNovelByIdAuthor(author.getIdAuthor());

	        Set<NovelResponeForAuthor> novelDTOs = novels.stream()
	                .map(novel -> NovelResponeForAuthor.builder()
	                        .idNovel(novel.getIdNovel())
	                        .nameNovel(novel.getNameNovel())
	                        .imageNovel(novel.getImageNovel())
	                        .build())
	                .collect(Collectors.toSet());

	        authorResponse.setNovels(novelDTOs); 
	        return authorResponse;
	    }).toList();
	}


	public AuthorRespone getAuthor(String idAuthor) {
		Author author = authorRepository.findById(idAuthor).get();
		Set<Novel> novels = authorRepository.getNovelByIdAuthor(idAuthor);
		AuthorRespone authorRespone = authorMapper.toAuthorRespone(author);

		log.info(novels.isEmpty() + "haha");
//		Set<NovelResponeForAuthor> novelResponeForAuthors=novels.stream().map(t -> )
//		authorRespone.setNovels(novels);
		return authorRespone;
	}

	public AuthorRespone createAuthor(AuthorCreationRequest request, MultipartFile file) throws IOException {
		Author author = authorMapper.toAuthor(request);

		if (file != null && !file.isEmpty()) {
			UploadFileRespone uploadFileRespone = uploadFileService.uploadFile(file);
			author.setImageAuthor(uploadFileRespone.getUrl());
			author.setPublicIDAuthor(uploadFileRespone.getPublic_id());
		}

		Set<Novel> novels = new HashSet<>(novelRepository.findAllById(request.getNovels()));
		author = authorRepository.save(author);

		for (Novel novel : novels) {
			novel.getAuthors().add(author);
			novelRepository.save(novel);
		}

		return authorMapper.toAuthorRespone(author);
	}

	public AuthorRespone updateAuthor(AuthorUpdateRequest request, MultipartFile file) throws IOException {

		Author author = authorMapper.toAuthorUpdate(request);

		Set<Novel> novels = new HashSet<>(novelRepository.findAllById(request.getNovels()));

		if (file != null && !file.isEmpty()) {

			if (author.getPublicIDAuthor() != null && !author.getPublicIDAuthor().isEmpty()) {
				uploadFileService.deleteImage(author.getPublicIDAuthor());
			}

			UploadFileRespone uploadFileRespone = uploadFileService.uploadFile(file);

			author.setImageAuthor(uploadFileRespone.getUrl());
			author.setPublicIDAuthor(uploadFileRespone.getPublic_id());
		}

		author = authorRepository.save(author);

		for (Novel novel : novels) {
			novel.getAuthors().add(author);
			novelRepository.save(novel);
		}

		return authorMapper.toAuthorRespone(author);
	}

	public String deleteById(String idAuthor) {
		try {
			Author author = authorRepository.findById(idAuthor).get();
			if (!author.getPublicIDAuthor().isEmpty()) {
				uploadFileService.deleteImage(author.getPublicIDAuthor());
			}
			authorRepository.deleteById(idAuthor);
			return idAuthor;
		} catch (Exception e) {
			throw new AppException(ErrorCode.DELETE_CONTRAINT);
		}

	}

}
