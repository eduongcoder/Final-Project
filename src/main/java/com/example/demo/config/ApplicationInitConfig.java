package com.example.demo.config;


import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.example.demo.entity.User;
import com.example.demo.enums.Role;
import com.example.demo.repository.IUserRepository;



@Configuration
public class ApplicationInitConfig {

	

	@Bean
	ApplicationRunner applicationRunner(IUserRepository userRepository) {
		return args -> {
			if (userRepository.findByUserNameUser("admin").isEmpty()) {
				PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
				User user = User.builder().userNameUser("admin").passwordUser(passwordEncoder.encode("Admin!22"))
						.emailUser("admin@gmail.com") 
						.role(Role.ADMIN)
						.build();

				userRepository.save(user);
			}
		};
	}
 
}
