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

import com.example.demo.dto.request.ChapterCreationRequest;
import com.example.demo.dto.request.CommentCreationRequest;
import com.example.demo.dto.request.CommentUpdateLikeRequest;
import com.example.demo.dto.request.CommentUpdateRequest;
import com.example.demo.dto.respone.ApiRespone;
import com.example.demo.dto.respone.ChapterRespone;
import com.example.demo.dto.respone.CommentNovelRespone;
import com.example.demo.dto.respone.CommentRespone;
import com.example.demo.service.CommentService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@RequestMapping("/comment")
@RestController
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Comment Controller", description = "API quản lý bình luận: tạo, chỉnh sửa, xoá, like/dislike, lọc theo chương, truyện hoặc người dùng")
public class CommentController {

	CommentService commentService;
	
	@GetMapping(value = "/getAllByChapter/{idChapter}")
	@Operation(summary = "Lấy danh sách bình luận theo chương", description = "Trả về danh sách các bình luận thuộc chương truyện có ID tương ứng.")
	public ApiRespone<List<CommentRespone>> getAllCommentByChapter(@PathVariable(name = "idChapter") Integer idChapter) {
		return ApiRespone.<List<CommentRespone>>builder()
				.result(commentService.getListCommentByChapter(idChapter))
				.build();
	}

	@GetMapping(value = "/getAllByUser/{idUser}")
	@Operation(summary = "Lấy danh sách bình luận theo người dùng", description = "Trả về tất cả bình luận được đăng bởi người dùng có ID tương ứng.")
	public ApiRespone<List<CommentRespone>> getAllCommentByUser(@PathVariable(name = "idUser") String idUser) {
		return ApiRespone.<List<CommentRespone>>builder()
				.result(commentService.getListCommentByUser(idUser))
				.build();
	}

	@GetMapping(value = "/getAllByNovel/{idNovel}")
	@Operation(summary = "Lấy danh sách bình luận theo truyện", description = "Trả về tất cả bình luận thuộc các chương của truyện có ID tương ứng.")
	public ApiRespone<List<CommentNovelRespone>> getAllCommentByNovel(@PathVariable(name = "idNovel") String idNovel) {
		return ApiRespone.<List<CommentNovelRespone>>builder()
				.result(commentService.getListCommentByNovel(idNovel))
				.build();
	}

	@PostMapping("/create")
	@Operation(summary = "Tạo bình luận mới", description = "Tạo mới một bình luận cho chương truyện.")
	public ApiRespone<CommentRespone> createChapter(@RequestBody CommentCreationRequest request) {
		log.info(request.getChapter() + "");
		return ApiRespone.<CommentRespone>builder()
				.result(commentService.createComment(request))
				.build();
	}

	@PutMapping("/update")
	@Operation(summary = "Cập nhật bình luận", description = "Chỉnh sửa nội dung bình luận hiện có.")
	public ApiRespone<CommentRespone> updateChapter(@RequestBody CommentUpdateRequest request) {
		return ApiRespone.<CommentRespone>builder()
				.result(commentService.updateComment(request))
				.build();
	}

	@PutMapping("/updatelike")
	@Operation(summary = "Tăng lượt like cho bình luận", description = "Tăng số lượt thích (like) cho bình luận.")
	public ApiRespone<CommentRespone> upLike(@RequestBody CommentUpdateLikeRequest request) {
		return ApiRespone.<CommentRespone>builder()
				.result(commentService.updatelikeComment(request))
				.build();
	}

	@PutMapping("/updatedislike")
	@Operation(summary = "Tăng lượt dislike cho bình luận", description = "Tăng số lượt không thích (dislike) cho bình luận.")
	public ApiRespone<CommentRespone> upDislike(@RequestBody CommentUpdateLikeRequest request) {
		return ApiRespone.<CommentRespone>builder()
				.result(commentService.updatedislikeComment(request))
				.build();
	}

	@DeleteMapping(value = "/{idComment}")
	@Operation(summary = "Xoá bình luận", description = "Xoá bình luận theo ID.")
	public ApiRespone<Integer> deleteComment(@PathVariable(name = "idComment") Integer idComment) {
		return ApiRespone.<Integer>builder()
				.result(commentService.deleteComment(idComment))
				.build();
	}
	
}
