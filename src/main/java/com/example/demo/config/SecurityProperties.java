package com.example.demo.config;

import java.util.List;
import java.util.Map;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import lombok.Data;

@Configuration
@ConfigurationProperties(prefix = "app.security")
@Data
public class SecurityProperties {
	private List<String> whitelist;
	private Map<String, List<String>> permission;
	private Map<String, List<String>> roles;
	
	

}
