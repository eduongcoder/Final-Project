package com.example.demo.service;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Map;
import java.util.UUID;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.demo.dto.respone.UploadFileRespone;
import com.example.demo.exception.AppException;
import com.example.demo.exception.ErrorCode;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
@Slf4j
public class UploadFileService {

	Cloudinary cloudinary;
	
	public UploadFileRespone uploadFile(MultipartFile file) throws IOException {
		assert file.getOriginalFilename()!=null;
		
		String publicValue=generatePublicValue(file.getOriginalFilename());
//		log.info("publicValue is: {}",publicValue);
		
		String[] parts=getFileName(file.getOriginalFilename());
		
		String extension=parts[parts.length-1];
//		log.info("extension is {}",extension);
		
		File fileUpload=convert(file); 
//		log.info("fileUpload is: {}",fileUpload);
		
		Map<String, Object> uploadResult= cloudinary.uploader().upload(fileUpload, ObjectUtils.asMap("public_id",publicValue));
		
		String public_ID=(String) uploadResult.get("public_id");
		String url=cloudinary.url().generate(StringUtils.join(publicValue,".",extension));
		
		
        cleanDisk(fileUpload);

		return  UploadFileRespone.builder().public_id(public_ID).url(url).build();
	}
	
	public String uploadAudio(byte[] audioData, String publicId) throws IOException {
        // resource_type = "video" is used for both audio and video files.
        Map uploadResult = cloudinary.uploader().upload(audioData, 
            ObjectUtils.asMap(
                "public_id", publicId,
                "resource_type", "video" // DÙNG "video" CHO FILE MP3
            ));
            
        // Lấy ra URL an toàn (https)
        return (String) uploadResult.get("secure_url");
    }
	
	public String deleteImage(String publicID)  {
		
		try {
			cloudinary.uploader().destroy(publicID, null);
			return "ok";
		} catch (IOException e) {
			throw new AppException(ErrorCode.ERROR_PUBLICID);
		}
		
	}
	
	   private File convert(MultipartFile file) throws IOException {
	        assert file.getOriginalFilename() != null;
			String[] parts=getFileName(file.getOriginalFilename());

	        File convFile = new File(StringUtils.join(generatePublicValue(file.getOriginalFilename()), parts[parts.length-1]));
	        try(InputStream is = file.getInputStream()) {
	            Files.copy(is, convFile.toPath());
	        }
	        return convFile;
	    }
	   private void cleanDisk(File file) {
	        try {
//	            log.info("file.toPath(): {}", file.toPath());
	            Path filePath = file.toPath();
	            Files.delete(filePath);
	        } catch (IOException e) {
	            log.error("Error when clean disk ");
	        }
	    }
	public String generatePublicValue(String originalName) {
		String[] parts=getFileName(originalName);
		String fileName=parts[0];
		fileName=fileName.replaceAll("\\s", "_");
		return StringUtils.join(UUID.randomUUID().toString(),"_", fileName);
	}
	
	public String[] getFileName(String originalName) {
		return originalName.split("\\.");
	}
	
}
