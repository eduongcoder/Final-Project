package com.example.demo.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.example.demo.dto.request.CategoryCreationRequest;
import com.example.demo.dto.request.CategoryUpdateRequest;
import com.example.demo.dto.respone.ApiRespone;
import com.example.demo.dto.respone.CategoryRespone;
import com.example.demo.service.CategoryService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.util.List;
import java.util.Optional;

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
public class CategoryController {

	CategoryService categoryService;

	@GetMapping("/getAll")
	public ApiRespone<List<CategoryRespone>> getAllCategory() {
		return ApiRespone.<List<CategoryRespone>>builder()
				.result(categoryService.getAllCategory())
				.build();
	}

	@PostMapping("/create")
	public ApiRespone<CategoryRespone> createCatehory(@RequestBody CategoryCreationRequest request) {

		return ApiRespone.<CategoryRespone>builder().result(categoryService.createCategory(request)).build();
	}

	@PutMapping("/update")
	public ApiRespone<CategoryRespone> updateCategory(@RequestBody CategoryUpdateRequest request) {

		return ApiRespone.<CategoryRespone>builder().result(categoryService.updateCategory(request)).build();
	}

	@DeleteMapping(value = "/{idCategory}")
	public ApiRespone<String> deleteCategory(@PathVariable String idCategory) {

		return ApiRespone.<String>builder().result(categoryService.deleteCategory(idCategory)).build();
	}
}
