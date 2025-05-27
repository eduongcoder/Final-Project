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

import com.example.demo.dto.request.AuthorCreationRequest;
import com.example.demo.dto.request.AuthorUpdateRequest;
import com.example.demo.dto.respone.ApiRespone;
import com.example.demo.dto.respone.AuthorRespone;
import com.example.demo.service.AuthorService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/author")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
@Tag(name = "Author Controller", description = "API quản lý tác giả: tạo, cập nhật, xoá và lấy thông tin")
public class AuthorController {

	AuthorService authorService;
	
	@GetMapping("/getAll")
	@Operation(summary = "Lấy danh sách tất cả tác giả", description = "Trả về danh sách đầy đủ các tác giả đang có trong hệ thống.")
	public ApiRespone<List<AuthorRespone>> getAll() {
		return ApiRespone.<List<AuthorRespone>>builder().result(authorService.getAll()).build();
	}

	@GetMapping(value = "/{idAuthor}")
	@Operation(summary = "Lấy thông tin chi tiết tác giả", description = "Trả về thông tin chi tiết của một tác giả theo ID.")
	public ApiRespone<AuthorRespone> getAuthorRespone(@PathVariable String idAuthor) {
		return ApiRespone.<AuthorRespone>builder().result(authorService.getAuthor(idAuthor)).build();
	}

	@PostMapping(value = "/create", consumes = { "multipart/form-data" })
	@Operation(summary = "Tạo mới tác giả", description = "Tạo một tác giả mới trong hệ thống, có thể kèm theo ảnh đại diện.")
	public ApiRespone<AuthorRespone> createAuthor(
			@RequestPart AuthorCreationRequest request,
			@RequestParam(required = false) MultipartFile image) throws IOException {
		return ApiRespone.<AuthorRespone>builder().result(authorService.createAuthor(request, image)).build();
	}

	@PutMapping(value = "/update", consumes = { "multipart/form-data" })
	@Operation(summary = "Cập nhật thông tin tác giả", description = "Cập nhật thông tin của tác giả, có thể kèm theo ảnh đại diện mới.")
	public ApiRespone<AuthorRespone> updateAuthor(
			@RequestPart AuthorUpdateRequest request,
			@RequestParam(required = false) MultipartFile image) throws IOException {
		return ApiRespone.<AuthorRespone>builder().result(authorService.updateAuthor(request, image)).build();
	}

	@DeleteMapping(value = "/{idAuthor}")
	@Operation(summary = "Xoá tác giả", description = "Xoá một tác giả ra khỏi hệ thống theo ID.")
	public ApiRespone<String> deleteAuthor(@PathVariable String idAuthor) {
		return ApiRespone.<String>builder().result(authorService.deleteById(idAuthor)).build();
	}
}
