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
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/author")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class AuthorController {

	AuthorService authorService;
	
	@GetMapping("/getAll")
	public ApiRespone<List<AuthorRespone>> getAll() {
		return ApiRespone.<List<AuthorRespone>>builder().result(authorService.getAll()).build();
	}
	
	@GetMapping(value = "/{idAuthor}")
	public ApiRespone<AuthorRespone> getAuthorRespone(@PathVariable String idAuthor) {
		return ApiRespone.<AuthorRespone>builder().result(authorService.getAuthor(idAuthor)).build();
	}
	
	@PostMapping(value = "/create",consumes = {"multipart/form-data"})
	public ApiRespone<AuthorRespone> createAuthor(@RequestPart AuthorCreationRequest request,@RequestParam(required = false) MultipartFile image) throws IOException {
		return ApiRespone.<AuthorRespone>builder().result(authorService.createAuthor(request,image)).build();
	}
	
	@PutMapping(value = "/update",consumes = {"multipart/form-data"})
	public ApiRespone<AuthorRespone> updateAuthor(@RequestPart AuthorUpdateRequest request,@RequestParam(required = false) MultipartFile image) throws IOException  {
		return ApiRespone.<AuthorRespone>builder().result(authorService.updateAuthor(request,image)).build();
	}
	
	@DeleteMapping(value = "/{idAuthor}") 
	public ApiRespone<String> deleteAuthor(@PathVariable String idAuthor) {
		return ApiRespone.<String>builder().result(authorService.deleteById(idAuthor)).build();
	}
}
