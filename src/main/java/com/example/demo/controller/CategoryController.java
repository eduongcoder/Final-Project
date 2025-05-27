package com.example.demo.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.example.demo.dto.request.CategoryCreationRequest;
import com.example.demo.dto.request.CategoryUpdateRequest;
import com.example.demo.dto.respone.ApiRespone;
import com.example.demo.dto.respone.CategoryRespone;
import com.example.demo.service.CategoryService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.util.List;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RequestMapping("/category")
@RestController
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Tag(name = "Category Controller", description = "API quản lý thể loại: tạo, cập nhật, xoá và lấy danh sách")
public class CategoryController {

	CategoryService categoryService;


	@GetMapping("/getAll")
	@Operation(summary = "Lấy danh sách tất cả thể loại", description = "Trả về danh sách đầy đủ các thể loại hiện có trong hệ thống.")
	public ApiRespone<List<CategoryRespone>> getAllCategory() {
		return ApiRespone.<List<CategoryRespone>>builder()
				.result(categoryService.getAllCategory())
				.build();
	}

	@PostMapping("/create")
	@Operation(summary = "Tạo mới thể loại", description = "Tạo một thể loại mới với các thông tin như tên, mô tả,...")
	public ApiRespone<CategoryRespone> createCatehory(@RequestBody CategoryCreationRequest request) {
		return ApiRespone.<CategoryRespone>builder()
				.result(categoryService.createCategory(request))
				.build();
	}

	@PutMapping("/update")
	@Operation(summary = "Cập nhật thể loại", description = "Cập nhật thông tin của một thể loại đã tồn tại.")
	public ApiRespone<CategoryRespone> updateCategory(@RequestBody CategoryUpdateRequest request) {
		return ApiRespone.<CategoryRespone>builder()
				.result(categoryService.updateCategory(request))
				.build();
	}

	@DeleteMapping(value = "/{idCategory}")
	@Operation(summary = "Xoá thể loại", description = "Xoá một thể loại ra khỏi hệ thống theo ID.")
	public ApiRespone<String> deleteCategory(@PathVariable String idCategory) {
		return ApiRespone.<String>builder()
				.result(categoryService.deleteCategory(idCategory))
				.build();
	}
}
