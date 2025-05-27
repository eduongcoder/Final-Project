package com.example.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

@Configuration 
public class CloudinaryConfig {

	@Bean
	public Cloudinary cloudinary() {
		Cloudinary c = new Cloudinary(ObjectUtils.asMap(
				"cloud_name", "dg8hjh2c7",
				"api_key", "946694782136981",
				"api_secret", "HxB-r09NySse7vhrkb2O6wTEflk",
				"secure", true));
		return c; 
	}
	
}
