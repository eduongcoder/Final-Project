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
import com.example.demo.dto.request.CommentCreationRequest;
import com.example.demo.dto.request.CommentUpdateLikeRequest;
import com.example.demo.dto.request.CommentUpdateRequest;
import com.example.demo.dto.respone.ApiRespone;
import com.example.demo.dto.respone.ChapterRespone;
import com.example.demo.dto.respone.CommentRespone;
import com.example.demo.service.CommentService;

import io.swagger.v3.oas.annotations.parameters.RequestBody;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RequestMapping("/comment")
@RestController
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class CommentController {

	CommentService commentService;
	
	@GetMapping(value = "/getAllByChapter/{idChapter}")
	ApiRespone<List<CommentRespone>> getAllCommentByChapter(@PathVariable(name = "idChapter") Integer idChapter){
		return ApiRespone.<List<CommentRespone>>builder().result(commentService.getListCommentByChapter(idChapter)).build();
	}
	
	@GetMapping(value = "/getAllByUser/{idUser}")
	ApiRespone<List<CommentRespone>> getAllCommentByUser(@PathVariable(name = "idUser") String idUser){
		return ApiRespone.<List<CommentRespone>>builder().result(commentService.getListCommentByUser(idUser)).build();
	}
	
	@PostMapping( "/create")
	public ApiRespone<CommentRespone> createChapter(@RequestBody CommentCreationRequest request)  {
		return ApiRespone.<CommentRespone>builder().result(commentService.createComment(request)).build();
	}
	
	@PutMapping("/update")
	public ApiRespone<CommentRespone> createChapter(@RequestBody CommentUpdateRequest request)  {
		return ApiRespone.<CommentRespone>builder().result(commentService.updateComment(request)).build();
	}
	
	@PutMapping("/updatelike")
	public ApiRespone<CommentRespone> upLike(@RequestBody CommentUpdateLikeRequest request)  {
		return ApiRespone.<CommentRespone>builder().result(commentService.updatelikeComment(request)).build();
	}
	
	@PutMapping("/updatedislike")
	public ApiRespone<CommentRespone> upDislike(@RequestBody CommentUpdateLikeRequest request)  {
		return ApiRespone.<CommentRespone>builder().result(commentService.updatedislikeComment(request)).build();
	}
	
	@DeleteMapping(value = "/{idComment}")
	public ApiRespone<Integer> deleteComment(@PathVariable(name = "idComment") Integer idComment)  {
		return ApiRespone.<Integer>builder().result(commentService.deleteComment(idComment)).build();
	}
	
}
