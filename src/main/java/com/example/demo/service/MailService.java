package com.example.demo.service;

import java.security.SecureRandom;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MailService {


    final JavaMailSender emailSender;
	
	private static final String OTP_CHARS = "0123456789";
	private static final SecureRandom random = new SecureRandom();

	

    public void sendOTPEmail(String to, String subject, String otp) {
    	  try {
    	        MimeMessage message = emailSender.createMimeMessage();
    	        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
    			String userName = to.split("@")[0];

    	        helper.setTo(to);
    	        helper.setSubject(subject);
    	        helper.setText(buildOtpHtmlContent(otp,userName), true); // true = HTML content

    	        emailSender.send(message);
    	    } catch (MessagingException e) {
    	        throw new RuntimeException("Failed to send email", e);
    	    }
    	
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText("Your OTP code is: " + otp);
        emailSender.send(message); 
    }

    String buildOtpHtmlContent(String otp, String name) {
        return """
            <html>
            <body style="font-family: Arial, sans-serif; color: #333;">
                <h2 style="color: #2E86C1;">Xác minh OTP của bạn</h2>
                <p>Chào bạn %s,</p>
                <p>Đây là mã OTP của bạn:</p>
                <h1 style="background-color: #f0f0f0; padding: 10px; display: inline-block;">%s</h1>
                <p>Vui lòng không chia sẻ mã này với bất kỳ ai.</p>
                <br/>
                <p>Trân trọng,</p>
                <p><i>Trương Thái Dương, Phan Thanh Vũ</i></p>
            </body>
            </html>
            """.formatted(name, otp);
    }

    
    public String generateOTP(int length) {
        StringBuilder otp = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            otp.append(OTP_CHARS.charAt(random.nextInt(OTP_CHARS.length())));
        }
        return otp.toString();
    }
	
	
}
