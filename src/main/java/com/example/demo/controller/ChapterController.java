package com.example.demo.controller;

import java.io.IOException;
import java.util.List;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.dto.request.ChapterCreationRequest;
import com.example.demo.dto.request.ChapterUpdateRequest;
import com.example.demo.dto.respone.ApiRespone;
import com.example.demo.dto.respone.ChapterRespone;
import com.example.demo.service.ChapterService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/chapter")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ChapterController {

	ChapterService chapterService;

	@GetMapping(value = "/getAll/{idNovel}")
	public ApiRespone<List<ChapterRespone>> getAll(@PathVariable String idNovel) {
		return ApiRespone.<List<ChapterRespone>>builder().result(chapterService.getAllChapter(idNovel)).build();
	}

	@GetMapping(value = "/{idChapter}")
	public ApiRespone<ChapterRespone> getChapterById(@PathVariable Integer idChapter) {
		return ApiRespone.<ChapterRespone>builder().result(chapterService.getChapterById(idChapter)).build();
	}

	@PostMapping(value = "/create", consumes = { "multipart/form-data" })
	public ApiRespone<ChapterRespone> createChapter(@RequestPart ChapterCreationRequest request,
			@RequestParam(required = false) MultipartFile textFile) throws IOException {
		return ApiRespone.<ChapterRespone>builder().result(chapterService.createChapter(request, textFile)).build();
	}

	@GetMapping(value = "increaseViewChapter/{idChapter}")
	public ApiRespone<Integer> increaseViewChapter(@PathVariable Integer idChapter) {
		return ApiRespone.<Integer>builder().result(chapterService.increaseView(idChapter)).build();
	}

	@PutMapping(value = "/update", consumes = { "multipart/form-data" })
	public ApiRespone<ChapterRespone> updateChapter(@RequestPart ChapterUpdateRequest request,
			@RequestParam(required = false) MultipartFile textFile) throws IOException {
		return ApiRespone.<ChapterRespone>builder().result(chapterService.updateChapter(request, textFile)).build();
	}

	@DeleteMapping(value = "/{idChapter}")
	public ApiRespone<Integer> deleteChapter(@PathVariable Integer idChapter) {
		return ApiRespone.<Integer>builder().result(chapterService.deleteChapter(idChapter)).build();
	}
}
