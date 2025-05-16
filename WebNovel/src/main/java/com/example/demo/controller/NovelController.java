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

import com.example.demo.dto.request.NovelCreatationRequest;
import com.example.demo.dto.request.NovelUpdateRequest;
import com.example.demo.dto.respone.ApiRespone;
import com.example.demo.dto.respone.NovelRespone;
import com.example.demo.service.NovelService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/novel")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class NovelController {

	NovelService novelService;
	
	@GetMapping("/getAll")
	public ApiRespone<List<NovelRespone>> getAll() {
		return ApiRespone.<List<NovelRespone>>builder().result(novelService.getAll()).build();
	}
	
	@GetMapping(value = "/{idNovel}")
	public ApiRespone<NovelRespone> getNovelRespone(@PathVariable String idNovel) {
		return ApiRespone.<NovelRespone>builder().result(novelService.getNovel(idNovel)).build();
	}
	
	@PostMapping(value = "/create",consumes = {"multipart/form-data"})
	public ApiRespone<NovelRespone> createNovel(@RequestPart NovelCreatationRequest request,@RequestParam(required = false) MultipartFile image) throws IOException {
		return ApiRespone.<NovelRespone>builder().result(novelService.createNovel(request,image)).build();
	}
	
	@PutMapping(value = "/update",consumes = {"multipart/form-data"})
	public ApiRespone<NovelRespone> updateNovel(@RequestPart NovelUpdateRequest request,@RequestParam(required = false) MultipartFile image) throws IOException {
		return ApiRespone.<NovelRespone>builder().result(novelService.updateNovel(request,image)).build();
	}
	
	@DeleteMapping(value = "/{idNovel}")
	public ApiRespone<String> deleteNovel(@PathVariable String idNovel) {
		return ApiRespone.<String>builder().result(novelService.deleteById(idNovel)).build();
	} 
}
