package com.example.demo.service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.dto.request.ChapterCreationRequest;
import com.example.demo.dto.request.ChapterUpdateRequest;
import com.example.demo.dto.respone.ChapterRespone;
import com.example.demo.entity.Chapter;
import com.example.demo.entity.Novel;
import com.example.demo.exception.AppException;
import com.example.demo.exception.ErrorCode;
import com.example.demo.mapper.IChapterMapper;
import com.example.demo.repository.IChapterRepository;
import com.example.demo.repository.INovelRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ChapterService {

	IChapterMapper chapterMapper;
	IChapterRepository chapterRepository;
	INovelRepository novelRepository;

	public List<ChapterRespone> getAllChapter(String idNovel) {

		return chapterRepository.findByNovel_IdNovel(idNovel).stream().map(t -> chapterMapper.toChapterRespone(t))
				.toList();
	}

	public ChapterRespone getChapterById(Integer idChapter) {
		return chapterMapper.toChapterRespone(chapterRepository.findById(idChapter).get());
	}

	public ChapterRespone createChapter(ChapterCreationRequest request, MultipartFile textFile) throws IOException {
		if (chapterRepository.existsByTitleChapter(request.getTitleChapter())) {
			throw new AppException(ErrorCode.CHAPTER_EXISTSED);
		}
		Chapter chapter = chapterMapper.toChapter(request);

		Novel novel = novelRepository.findById(request.getNovel()).get();

		chapter.setNovel(novel);

		if (textFile != null && !textFile.isEmpty()) {
			String originalFilename = textFile.getOriginalFilename();
			if (originalFilename != null && originalFilename.toLowerCase().endsWith(".txt")) {
				String cotent = new String(textFile.getBytes(), StandardCharsets.UTF_8);
				chapter.setContentChapter(cotent);
			} else {
				throw new AppException(ErrorCode.FILE_MUST_TXT);
			}
		}

		chapter = chapterRepository.save(chapter);

		return chapterMapper.toChapterRespone(chapter);
	}

	public Integer deleteChapter(Integer idChapter) {
		if (!chapterRepository.existsById(idChapter)) {
			throw new AppException(ErrorCode.CHAPTER_NOT_EXISTED);
		}
		try {
			chapterRepository.deleteById(idChapter);

		} catch (Exception e) {
			throw new AppException(ErrorCode.DELETE_CONTRAINT);
		}
		return idChapter;
	}

	public ChapterRespone updateChapter(ChapterUpdateRequest request, MultipartFile textFile) throws IOException {
		Chapter chapter = chapterMapper.toChapterUpdate(request);
		if (!chapterRepository.existsById(request.getIdChapter())) {
			throw new AppException(ErrorCode.CHAPTER_NOT_EXISTED);
		}

		Novel novel = novelRepository.findById(request.getNovel()).get();

		chapter.setNovel(novel);
		if (textFile != null && !textFile.isEmpty()) {
			String originalFilename = textFile.getOriginalFilename();
			if (originalFilename != null && originalFilename.toLowerCase().endsWith(".txt")) {
				String cotent = new String(textFile.getBytes(), StandardCharsets.UTF_8);
				chapter.setContentChapter(cotent);
			} else {
				throw new AppException(ErrorCode.FILE_MUST_TXT);
			}
		}

		chapter = chapterRepository.save(chapter);

		return chapterMapper.toChapterRespone(chapter);
	}
}
