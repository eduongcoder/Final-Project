package com.example.demo.service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.dto.request.UserCreationByEmailRequest;
import com.example.demo.dto.request.UserCreationRequest;
import com.example.demo.dto.request.UserLoginByEmailRequest;
import com.example.demo.dto.request.UserLoginRequest;
import com.example.demo.dto.request.NovelRemoveAuthorRequest;
import com.example.demo.dto.request.UserUpdateRequest;
import com.example.demo.dto.respone.HistoryReadRespone;
import com.example.demo.dto.respone.UploadFileRespone;
import com.example.demo.dto.respone.UserRespone;
import com.example.demo.entity.Author;
import com.example.demo.entity.HistoryId;
import com.example.demo.entity.HistoryRead;
import com.example.demo.entity.Novel;
import com.example.demo.entity.User;
import com.example.demo.exception.AppException;
import com.example.demo.exception.ErrorCode;
import com.example.demo.mapper.IHistoryReadMapper;
import com.example.demo.mapper.IUserMapper;
import com.example.demo.repository.IAuthorRepository;
import com.example.demo.repository.IHistoryReadRepository;
import com.example.demo.repository.INovelRepository;
import com.example.demo.repository.IUserRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserService {

	IUserRepository userRepository;
	IUserMapper userMapper;
	PasswordEncoder passwordEncoder;
	UploadFileService uploadFileService;
	INovelRepository novelRepository;
	IHistoryReadRepository historyReadRepository;
	IHistoryReadMapper historyReadMapper;
	HistoryReadService historyReadService;
	
	public List<UserRespone> getAllUser() {
		return userRepository.findAll().stream().map(t -> userMapper.toUserRespone(t)).toList();
	}

	public UserRespone createUser(UserCreationRequest request) {

		User user = userRepository.findByEmailUser(request.getEmailUser());

		if (user != null) {
			throw new AppException(ErrorCode.USER_EXISTED);
		}
		String userName = request.getEmailUser().split("@")[0];

		user = userMapper.toUser(request);
		user.setUserNameUser(userName);
		user.setCoin(0);
		user.setPasswordUser(passwordEncoder.encode(request.getPasswordUser()));
		return userMapper.toUserRespone(userRepository.save(user));

	}

	public UserRespone createUserByEmail(UserCreationByEmailRequest request) {

		User user = userRepository.findByEmailUser(request.getEmail());

		if (user != null) {
			throw new AppException(ErrorCode.USER_EXISTED);
		}

		String userName = request.getEmail().split("@")[0];

		user = userMapper.toUserByEmail(request);
		user.setCoin(0);
		user.setUserNameUser(userName);

		return userMapper.toUserRespone(userRepository.save(user));
	}

	public UserRespone login(UserLoginRequest request) {

		User user = userRepository.findByEmailUser(request.getEmail());
		if (user == null) {
			throw new AppException(ErrorCode.USER_NOT_EXISTED);
		}

		PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
		boolean matches = passwordEncoder.matches(request.getPassword(), user.getPasswordUser());

		if (!matches) {
			throw new AppException(ErrorCode.PASSWORD_NOT_MATCHED);
		}

		UserRespone userRespone= userMapper.toUserRespone(user);
		List<HistoryReadRespone> historyReadRespones=historyReadService.getHistoryRead(userRespone.getIdUser());
		userRespone.setHistoryRead(historyReadRespones);
		
		return userRespone;
	}

	public UserRespone loginByEmail(UserLoginByEmailRequest request) {

		User user = userRepository.findByEmailUser(request.getEmail());
		if (user == null) {
			createUserByEmail(UserCreationByEmailRequest.builder().email(request.getEmail()).build());
		}

		UserRespone userRespone= userMapper.toUserRespone(user);
		List<HistoryReadRespone> historyReadRespones=historyReadService.getHistoryRead(userRespone.getIdUser());
		userRespone.setHistoryRead(historyReadRespones);
		
		return userRespone;
	}

	public UserRespone updateUser(UserUpdateRequest request) throws IOException {
		User user = userRepository.findByEmailUser(request.getEmailUser());

		if (user == null) {
			throw new AppException(ErrorCode.USER_NOT_EXISTED);
		}

		userMapper.updateUser(request, user);

		return userMapper.toUserRespone(userRepository.save(user));

	}
	
	public UserRespone uploadUser(MultipartFile avatar, String email) throws IOException {
		User user = userRepository.findByEmailUser(email);

		if (user == null) {
			throw new AppException(ErrorCode.USER_NOT_EXISTED);
		}
		if (user.getAvatarUser() != null) {
			uploadFileService.deleteImage(user.getPublicIdAvartarUser());
		}
		UploadFileRespone respone = uploadFileService.uploadFile(avatar);
		user.setAvatarUser(respone.getUrl());
		user.setPublicIdAvartarUser(respone.getPublic_id());
		return userMapper.toUserRespone(userRepository.save(user));

	}
	
	public String deleteUser(String idUser) {
		User user = userRepository.findByIdUser(idUser);
		if (user == null) {
			throw new AppException(ErrorCode.USER_NOT_EXISTED);
		}
		userRepository.deleteById(idUser);
		return idUser;
	}
	

	
	public UserRespone createHistoryRead(String idNovel, String email, String titleChapter) {
		User user = userRepository.findByEmailUser(email);
		Novel novel = novelRepository.findById(idNovel).get();

		HistoryId historyId = HistoryId.builder()
										.idNovel(idNovel)
										.idUser(user.getIdUser())
										.build();


		HistoryRead historyRead = HistoryRead.builder().id(historyId).novel(novel).readingTime(LocalDateTime.now())
				.titleChapter(titleChapter).user(user).build();

		Optional<HistoryRead> historyReadPast = historyReadRepository.findById(historyId);

		if (!historyReadPast.isEmpty()) {

			historyReadMapper.updateHistoryRead(historyRead, historyReadPast.get());
			historyReadRepository.save(historyReadPast.get());
			return userMapper.toUserRespone(user);

		}
		historyReadRepository.save(historyRead);

		return userMapper.toUserRespone(user);
	}
	
}
