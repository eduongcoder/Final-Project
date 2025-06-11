package com.example.demo.service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.dto.request.ChapterCreationRequest;
import com.example.demo.dto.request.ChapterUpdateRequest;
import com.example.demo.dto.respone.ChapterRespone;
import com.example.demo.entity.Chapter;
import com.example.demo.entity.Novel;
import com.example.demo.exception.AppException;
import com.example.demo.exception.ErrorCode;
import com.example.demo.mapper.IChapterMapper;
import com.example.demo.repository.IChapterRepository;
import com.example.demo.repository.INovelRepository;

import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ChapterService {

	IChapterMapper chapterMapper;
	IChapterRepository chapterRepository;
	INovelRepository novelRepository;
	TextService textService;
	
	private static final Logger logger = LoggerFactory.getLogger(ChapterService.class);

	
	// public List<ChapterRespone> getAll(){
	// 	return chapterRepository.getAll().stream().map(t -> chapterMapper.toChapterRespone(t)).toList();
	// }

	public List<ChapterRespone> getAllChapter(String idNovel) {

		return chapterRepository.findByNovel_IdNovel(idNovel).stream().map(t -> chapterMapper.toChapterRespone(t))
				.toList();
	}

	public ChapterRespone getChapterById(Integer idChapter) {
		return chapterMapper.toChapterRespone(chapterRepository.findById(idChapter).get());
	}

	@Transactional
	public ChapterRespone createChapter(ChapterCreationRequest request, MultipartFile textFile) throws IOException, InterruptedException {
		if (chapterRepository.existsByTitleChapter(request.getTitleChapter())) {
			throw new AppException(ErrorCode.CHAPTER_EXISTSED);
		}
		Chapter chapter = chapterMapper.toChapter(request);
		
		Novel novel = novelRepository.findById(request.getNovel()).get();

		chapter.setNovel(novel);
		chapter.setViewChapter(0);
		if (textFile != null && !textFile.isEmpty()) {
			String originalFilename = textFile.getOriginalFilename();
			if (originalFilename != null && originalFilename.toLowerCase().endsWith(".txt")) {
				String cotent = new String(textFile.getBytes(), StandardCharsets.UTF_8);
				chapter.setContentChapter(cotent);
			} else {
				throw new AppException(ErrorCode.FILE_MUST_TXT);
			}
		}

		chapter = chapterRepository.save(chapter);
			
		Path audioFilePath= textService.convert(chapter.getContentChapter());
		
		 if (audioFilePath != null) {
		        logger.info("Audio file generated at: {}", audioFilePath);
		        try {
		            // Đọc file thành byte[]
		            byte[] audioBytes = Files.readAllBytes(audioFilePath);
		            chapter.setAudioFile(audioBytes);
		            
		            // Cập nhật chapter với dữ liệu audio
		            chapterRepository.save(chapter);
		            logger.info("Successfully saved audio file to database for chapter ID: {}", chapter.getIdChapter());

		        } catch (IOException e) {
		            logger.error("Failed to read audio file from path: {}", audioFilePath, e);
		            throw new AppException(ErrorCode.CANNOT_READ_AUDIO_FILE);
//		        } finally {
//		            // Dọn dẹp file tạm
//		            Files.deleteIfExists(audioFilePath);
//		            logger.info("Deleted temporary audio file: {}", audioFilePath);
		        }
		    } else {
		        // Xử lý khi service không thể tạo được file audio
		        logger.error("Failed to generate audio for chapter ID: {}", chapter.getIdChapter());
		        // Ở đây bạn có thể không làm gì cả, hoặc ném lỗi tùy theo yêu cầu nghiệp vụ
		    }
		
		return chapterMapper.toChapterRespone(chapter);
	}

	public Integer deleteChapter(Integer idChapter) {
		if (!chapterRepository.existsById(idChapter)) {
			throw new AppException(ErrorCode.CHAPTER_NOT_EXISTED);
		}
		try {
			chapterRepository.deleteById(idChapter);

		} catch (Exception e) {
			throw new AppException(ErrorCode.DELETE_CONTRAINT);
		}
		return idChapter;
	}

	public Integer increaseView(Integer idChapter){
		Chapter chapter=chapterRepository.findById(idChapter).get();
		chapter.setViewChapter(chapter.getViewChapter()+1);
		chapterRepository.save(chapter);
		return chapter.getViewChapter();
	}

	public ChapterRespone updateChapter(ChapterUpdateRequest request, MultipartFile textFile) throws IOException {
		Chapter chapterOgirin=chapterRepository.findById(request.getIdChapter()).get();
		Chapter chapter = chapterMapper.toChapterUpdate(request);
		
		chapterOgirin=chapterMapper.toChapterbyChapter(chapter);
		if (!chapterRepository.existsById(request.getIdChapter())) {
			throw new AppException(ErrorCode.CHAPTER_NOT_EXISTED);
		}

		Novel novel = novelRepository.findById(request.getNovel()).get();

		chapterOgirin.setNovel(novel);
		if (textFile != null && !textFile.isEmpty()) {
			String originalFilename = textFile.getOriginalFilename();
			if (originalFilename != null && originalFilename.toLowerCase().endsWith(".txt")) {
				String cotent = new String(textFile.getBytes(), StandardCharsets.UTF_8);
				chapterOgirin.setContentChapter(cotent);
			} else {
				throw new AppException(ErrorCode.FILE_MUST_TXT);
			}
		}
		try {
			chapterOgirin = chapterRepository.save(chapterOgirin);
		} catch (Exception e) {
			e.printStackTrace();
		}	
		

		return chapterMapper.toChapterRespone(chapterOgirin);
	}
}
