package com.example.demo.config;

import java.util.Collection;
import java.util.Set;

import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder(10);
	}

	@Value("${app.security.singer-key}")
	private String SIGNER_KEY;

	@Autowired
	private SecurityProperties securityProperties;

	@Bean
	public SecurityFilterChain filterChain(HttpSecurity httpSecurity, RolePermissionResolver resolver)
			throws Exception {
		httpSecurity.cors(cors -> cors.configurationSource(corsConfigurationSource()));

		httpSecurity.oauth2ResourceServer(oauth2 -> oauth2
				.jwt(jwt -> jwt.decoder(jwtDecoder()).jwtAuthenticationConverter(jwtAuthenticationConverter())));

		httpSecurity.authorizeHttpRequests(auth -> {
			// ✅ WHITELIST
			for (String endpoint : resolver.getWhitelist()) {
				String[] parts = endpoint.split(":", 2);
				// log.info("✅ Whitelisted: {} {}", parts[0], parts[1]);
				auth.requestMatchers(HttpMethod.valueOf(parts[0]), parts[1]).permitAll();
			}

			// ✅ ROLE-PERMISSION MAPPING
			for (String role : securityProperties.getRoles().keySet()) {
				Set<String> endpoints = resolver.getEndpointsForRole(role);
				// log.info("🔐 Role {} has endpoints: {}", role, endpoints);
				for (String endpoint : endpoints) {
					String[] parts = endpoint.split(":", 2);
					// log.info("➡️ Mapping role [{}] to: {} {}", role, parts[0], parts[1]);
					// log.info("🔍 Comparing with ROLE_MANAGER equals: {}",
					// "ROLE_MANAGER".equals(role));
					auth.requestMatchers(HttpMethod.valueOf(parts[0]), parts[1]).hasAuthority(role.toString());
				}
			}

			auth.anyRequest().authenticated();
		});

		httpSecurity.csrf(AbstractHttpConfigurer::disable);

		return httpSecurity.build();
	}

	@Bean
	JwtDecoder jwtDecoder() {
		SecretKeySpec secretKeySpec = new SecretKeySpec(SIGNER_KEY.getBytes(), "HS512");
		return NimbusJwtDecoder.withSecretKey(secretKeySpec).macAlgorithm(MacAlgorithm.HS512).build();
	}

	@Bean
	JwtAuthenticationConverter jwtAuthenticationConverter() {
		JwtGrantedAuthoritiesConverter jwtGrantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();
		jwtGrantedAuthoritiesConverter.setAuthoritiesClaimName("scope");
		jwtGrantedAuthoritiesConverter.setAuthorityPrefix("ROLE_");

		JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
		jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(jwt -> {
			Collection<GrantedAuthority> authorities = jwtGrantedAuthoritiesConverter.convert(jwt);
			// log.info("✅ Authorities in token: {}", authorities);
			return authorities;
		});

		return jwtAuthenticationConverter;
	}

	// @Bean
	// public CorsFilter corsFilter() {
	// CorsConfiguration config = new CorsConfiguration();
	// config.addAllowedOriginPattern("*"); // Cho phép tất cả origin
	// config.addAllowedHeader("*"); // Cho phép tất cả header
	// config.addAllowedMethod("*"); // Cho phép tất cả method
	// config.setAllowCredentials(true); // Cho phép gửi cookie hoặc thông tin xác
	// thực

	// UrlBasedCorsConfigurationSource source = new
	// UrlBasedCorsConfigurationSource();
	// source.registerCorsConfiguration("/**", config); // Áp dụng cho tất cả
	// endpoint
	// return new CorsFilter(source);
	// }

	@Bean
	public UrlBasedCorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration config = new CorsConfiguration();
		config.addAllowedOriginPattern("*"); // Cho phép tất cả origin
		config.addAllowedHeader("*"); // Cho phép tất cả header
		config.addAllowedMethod("*"); // Cho phép tất cả method
		config.setAllowCredentials(true); // Cho phép gửi cookie hoặc thông tin xác thực

		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", config); // Áp dụng cho tất cả endpoint
		return source;
	}
}
