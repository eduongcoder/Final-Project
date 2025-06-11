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
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.dto.request.LoginRequest;
import com.example.demo.dto.request.UserCreationByEmailRequest;
import com.example.demo.dto.request.UserCreationRequest;
import com.example.demo.dto.request.UserLoginByEmailRequest;
import com.example.demo.dto.request.UserLoginRequest;
import com.example.demo.dto.request.UserUpdateRequest;
import com.example.demo.dto.respone.ApiRespone;
import com.example.demo.dto.respone.HistoryReadRespone;
import com.example.demo.dto.respone.UserRespone;
import com.example.demo.entity.HistoryId;
import com.example.demo.service.HistoryReadService;
import com.example.demo.service.MailService;
import com.example.demo.service.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
@Tag(name = "User Controller", description = "API quản lý người dùng: đăng ký, đăng nhập, cập nhật, xoá, OTP, avatar và lịch sử đọc")
public class UserController {

	UserService userService;
	MailService mailService;
	HistoryReadService historyReadService;

	@GetMapping("/getAllUser")
	@Operation(summary = "Lấy tất cả người dùng", description = "Trả về danh sách tất cả người dùng hiện có trong hệ thống.")
	public ApiRespone<List<UserRespone>> getAllUser() {
		return ApiRespone.<List<UserRespone>>builder().result(userService.getAllUser()).build();
	}

	@PostMapping("/createUser")
	@Operation(summary = "Tạo người dùng mới", description = "Đăng ký người dùng thông thường bằng thông tin tài khoản.")
	public ApiRespone<UserRespone> createUser(@RequestBody UserCreationRequest request) {
		return ApiRespone.<UserRespone>builder().result(userService.createUser(request)).build();
	}

	@PostMapping("/createUserByEmail")
	@Operation(summary = "Tạo người dùng bằng email", description = "Đăng ký người dùng chỉ bằng email (dùng cho xác thực OTP).")
	public ApiRespone<UserRespone> createUserByEmail(@RequestBody UserCreationByEmailRequest request) {
		return ApiRespone.<UserRespone>builder().result(userService.createUserByEmail(request)).build();
	}

	@PostMapping("/sendOTP")
	@Operation(summary = "Gửi OTP qua email", description = "Gửi mã OTP (6 chữ số) tới địa chỉ email để xác thực.")
	public ApiRespone<String> sendOTP(@RequestParam String email) {
		String otp = mailService.generateOTP(6);
		mailService.sendOTPEmail(email, "Xác nhận OTP", otp);
		return ApiRespone.<String>builder().result(otp).build();
	}

	@PostMapping("/login")
	@Operation(summary = "Đăng nhập", description = "Đăng nhập bằng tài khoản thông thường (email và mật khẩu).")
	public ApiRespone<UserRespone> login(@RequestBody 	UserLoginRequest request) {
		return ApiRespone.<UserRespone>builder().result(userService.login(request)).build();
	}

	@PostMapping("/loginByEmail")
	@Operation(summary = "Đăng nhập bằng email", description = "Đăng nhập nhanh chỉ với email (dành cho OTP).")
	public ApiRespone<UserRespone> loginByEmail(@RequestBody UserLoginByEmailRequest request) {
		return ApiRespone.<UserRespone>builder().result(userService.loginByEmail(request)).build();
	}

	@PostMapping(value = "/uploadAvatar", consumes = { "multipart/form-data" })
	@Operation(summary = "Cập nhật avatar người dùng", description = "Tải ảnh đại diện mới cho người dùng theo email.")
	public ApiRespone<UserRespone> uploadAvatar(@RequestParam MultipartFile image, @RequestParam String email)
			throws IOException {
		return ApiRespone.<UserRespone>builder().result(userService.uploadUser(image, email)).build();
	}

	@PutMapping(value = "/updateUser")
	@Operation(summary = "Cập nhật thông tin người dùng", description = "Chỉnh sửa thông tin của người dùng.")
	public ApiRespone<UserRespone> updateUser(@RequestBody UserUpdateRequest request) throws IOException {
		return ApiRespone.<UserRespone>builder().result(userService.updateUser(request)).build();
	}

	@DeleteMapping("/deleteUser")
	@Operation(summary = "Xoá người dùng", description = "Xoá người dùng theo ID.")
	public ApiRespone<String> deleteUser(@RequestParam String idUser) {
		return ApiRespone.<String>builder().result(userService.deleteUser(idUser)).build();
	}

	@PostMapping("/createHistory")
	@Operation(summary = "Thêm lịch sử đọc chương truyện", description = "Tạo lịch sử đọc chương truyện theo email, ID truyện và tiêu đề chương.")
	public ApiRespone<UserRespone> createHistory(@RequestParam String idNovel, @RequestParam String email,
			@RequestParam String titleChapter) {
		return ApiRespone.<UserRespone>builder().result(userService.createHistoryRead(idNovel, email, titleChapter))
				.build();
	}

	@DeleteMapping("/deleteHistory")
	@Operation(summary = "Xoá lịch sử đọc", description = "Xoá lịch sử đọc truyện theo đối tượng HistoryId.")
	public ApiRespone<String> deleteHistory(@RequestBody HistoryId historyId) {
		return ApiRespone.<String>builder().result(historyReadService.deleteHistoryRead(historyId)).build();
	}

	@GetMapping("/getHistory")
	@Operation(summary = "Lấy lịch sử đọc", description = "Trả về danh sách các chương truyện đã đọc của người dùng theo ID.")
	public ApiRespone<List<HistoryReadRespone>> getHistory(@RequestParam String idUser) {
		return ApiRespone.<List<HistoryReadRespone>>builder().result(historyReadService.getHistoryRead(idUser)).build();
	}

	@PutMapping(value = "/grantRole/{idUser}")
	@Operation(summary = "Trao quyền manager cho tài khoản", description = "Nhập id User dạng string, nó sẽ kiếm thấy thì thao quyền manager không thấy thì báo ko tìm thấy, token được trả về là token mới có role mới")
	ApiRespone<UserRespone> grantRole(@PathVariable String idUser) {
		return ApiRespone.<UserRespone>builder().result(userService.grantRole(idUser)).build();
	}

//	@PostMapping("/register")
//	UserDTO register(@RequestBody RegisterRequest registerRequest) {
////		JsonSchemaValidator.validate(registerRequest, "registerSchema.json");
//
//		UserDTO userDTO = userService.createUser(registerRequest);
//
//		if (userDTO == null) {
//			return null;
//		} else {
//			return userDTO;
//		}
//	}

}
