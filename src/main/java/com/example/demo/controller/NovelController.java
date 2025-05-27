package com.example.demo.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.dto.request.NovelAddAuthorRequest;
import com.example.demo.dto.request.NovelAddCategoryRequest;
import com.example.demo.dto.request.NovelCreatationRequest;
import com.example.demo.dto.request.NovelRemoveAuthorRequest;
import com.example.demo.dto.request.NovelRemoveCategoryRequest;
import com.example.demo.dto.request.NovelUpdateRequest;
import com.example.demo.dto.respone.ApiRespone;
import com.example.demo.dto.respone.NovelRespone;
import com.example.demo.service.NovelService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/novel")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
@Tag(name = "Novel Controller", description = "API quản lý tiểu thuyết: tạo, cập nhật, xoá, và xử lý 1 chút xíu tác giả & thể loại")
public class NovelController {

	NovelService novelService;

	@GetMapping("/getAll")
	@Operation(summary = "Lấy toàn bộ novel", description = "Thì có vậy hoi á lấy toàn bộ Novel")
	public ApiRespone<List<NovelRespone>> getAll() {
		return ApiRespone.<List<NovelRespone>>builder().result(novelService.getAll()).build();
	}

	@GetMapping(value = "/{idNovel}")
	@Operation(summary = "Lấy thông tin chi tiết tiểu thuyết", description = "Lấy dữ liệu của một tiểu thuyết dựa theo ID.")
	public ApiRespone<NovelRespone> getNovelRespone(@PathVariable String idNovel) {
		return ApiRespone.<NovelRespone>builder().result(novelService.getNovel(idNovel)).build();
	}

	@PostMapping(value = "/create", consumes = { "multipart/form-data" })
	@Operation(summary = "Tạo mới tiểu thuyết", description = "Tạo một tiểu thuyết mới, có thể kèm theo ảnh bìa (image).")
	public ApiRespone<NovelRespone> createNovel(@RequestPart NovelCreatationRequest request,
			@RequestParam(required = false) MultipartFile image) throws IOException {
		return ApiRespone.<NovelRespone>builder().result(novelService.createNovel(request, image)).build();
	}

	@PutMapping(value = "/update", consumes = { "multipart/form-data" })
	@Operation(summary = "Cập nhật thông tin tiểu thuyết", description = "Cập nhật thông tin của một tiểu thuyết, có thể kèm theo ảnh bìa mới.")
	public ApiRespone<NovelRespone> updateNovel(@RequestPart NovelUpdateRequest request,
			@RequestParam(required = false) MultipartFile image) throws IOException {
		return ApiRespone.<NovelRespone>builder().result(novelService.updateNovel(request, image)).build();
	}

	@DeleteMapping(value = "/{idNovel}")
	@Operation(summary = "Xoá tiểu thuyết", description = "Xoá một tiểu thuyết dựa theo ID.")
	public ApiRespone<String> deleteNovel(@PathVariable String idNovel) {
		return ApiRespone.<String>builder().result(novelService.deleteById(idNovel)).build();
	}

	@PostMapping("/addAuthor")
	@Operation(summary = "Thêm tác giả vào tiểu thuyết", description = "Thêm một tác giả vào danh sách tác giả của tiểu thuyết.")
	public ApiRespone<NovelRespone> addAuthor(@RequestBody NovelAddAuthorRequest request) {
		return ApiRespone.<NovelRespone>builder().result(novelService.addAuthor(request)).build();
	}

	@PostMapping("/removeAuthor")
	@Operation(summary = "Xoá tác giả khỏi tiểu thuyết", description = "Xoá một tác giả khỏi danh sách tác giả của tiểu thuyết.")
	public ApiRespone<NovelRespone> removeAuthor(@RequestBody NovelRemoveAuthorRequest request) {
		return ApiRespone.<NovelRespone>builder().result(novelService.removeAuthor(request)).build();
	}

	@PostMapping("/addCategory")
	@Operation(summary = "Thêm thể loại vào tiểu thuyết", description = "Thêm một thể loại vào danh sách thể loại của tiểu thuyết.")
	public ApiRespone<NovelRespone> addCategory(@RequestBody NovelAddCategoryRequest request) {
		return ApiRespone.<NovelRespone>builder().result(novelService.addCategory(request)).build();
	}

	@PostMapping("/removeCategory")
	@Operation(summary = "Xoá thể loại khỏi tiểu thuyết", description = "Xoá một thể loại khỏi danh sách thể loại của tiểu thuyết.")
	public ApiRespone<NovelRespone> removeCategory(@RequestBody NovelRemoveCategoryRequest request) {
		return ApiRespone.<NovelRespone>builder().result(novelService.removeCategory(request)).build();
	}
}
