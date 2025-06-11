package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.service.HtmlFetcherService;

import java.io.IOException;
import java.nio.charset.StandardCharsets; // Import thêm
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class HtmlFetcherController {

//    private final HtmlFetcherService htmlFetcherService;

    // Sử dụng hằng số timeout từ Service nếu bạn muốn đồng bộ
    // Hoặc định nghĩa một hằng số riêng cho Controller
    private final HtmlFetcherService htmlFetcherService;
    private static final int CONTROLLER_DEFAULT_JSOUP_TIMEOUT = 15000;

    @Autowired
    public HtmlFetcherController(HtmlFetcherService htmlFetcherService) {
        this.htmlFetcherService = htmlFetcherService;
    }

    @GetMapping("/fetch-html")
    public ResponseEntity<String> getFullHtmlPage(
            @RequestParam String url,
            @RequestParam(required = false, defaultValue = "false") boolean attemptReveal, // Thêm tham số này
            @RequestParam(required = false) String userAgent // Cho phép tùy chỉnh User-Agent
    ) {
        if (url == null || url.trim().isEmpty()) {
            HttpHeaders errorHeaders = new HttpHeaders();
            errorHeaders.setContentType(new MediaType("text", "plain", StandardCharsets.UTF_8));
            return new ResponseEntity<>("Tham số 'url' là bắt buộc.", errorHeaders, HttpStatus.BAD_REQUEST);
        }

        try {
            String htmlContent = htmlFetcherService.fetchFullHtml(url, attemptReveal, userAgent);

            HttpHeaders responseHeaders = new HttpHeaders();
            // Quan trọng: Trả về HTML với encoding UTF-8
            responseHeaders.setContentType(new MediaType("text", "html", StandardCharsets.UTF_8));
            return new ResponseEntity<>(htmlContent, responseHeaders, HttpStatus.OK);

        } catch (IOException e) {
            // Các lỗi từ Playwright (như TimeoutError, PlaywrightException) sẽ được bọc trong IOException bởi service
            HttpHeaders errorHeaders = new HttpHeaders();
            errorHeaders.setContentType(new MediaType("text", "plain", StandardCharsets.UTF_8));
            return new ResponseEntity<>("Lỗi khi lấy HTML từ URL: " + e.getMessage(), errorHeaders, HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) { // Bắt các lỗi Runtime không mong muốn khác
             HttpHeaders errorHeaders = new HttpHeaders();
            errorHeaders.setContentType(new MediaType("text", "plain", StandardCharsets.UTF_8));
            return new ResponseEntity<>("Lỗi không xác định trong quá trình xử lý: " + e.getMessage(), errorHeaders, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    

//    @GetMapping("/fetch-html")
//    public ResponseEntity<String> getFullHtmlPage(@RequestParam String url,
//                                                  @RequestParam(required = false) String userAgent,
//                                                  @RequestParam(required = false) Integer timeout) {
//        if (url == null || url.trim().isEmpty()) {
//            // Trả về lỗi với Content-Type là text/plain và UTF-8
//            HttpHeaders errorHeaders = new HttpHeaders();
//            errorHeaders.setContentType(new MediaType("text", "plain", StandardCharsets.UTF_8));
//            return new ResponseEntity<>("Tham số 'url' là bắt buộc.", errorHeaders, HttpStatus.BAD_REQUEST);
//        }
//
//        Map<String, String> customHeaders = new HashMap<>();
//        // Ví dụ: customHeaders.put("Accept-Language", "vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7");
//
//        // Sử dụng timeout từ request hoặc default
//        // Đảm bảo DEFAULT_TIMEOUT của service được truy cập đúng cách hoặc dùng hằng số của controller
//        // Nếu DEFAULT_TIMEOUT trong service là private static, bạn không truy cập trực tiếp được.
//        // Cách tốt hơn là service có getter cho default timeout hoặc controller tự có default.
//        int timeoutMillis = (timeout != null && timeout > 0) ? timeout : CONTROLLER_DEFAULT_TIMEOUT;
//
//
//        try {
//            String htmlContent = htmlFetcherService.fetchFullHtml(url, userAgent, customHeaders, timeoutMillis);
//            HttpHeaders responseHeaders = new HttpHeaders();
//            // Đảm bảo Content-Type là text/html và charset là UTF-8
//            responseHeaders.setContentType(new MediaType("text", "html", StandardCharsets.UTF_8));
//            return new ResponseEntity<>(htmlContent, responseHeaders, HttpStatus.OK);
//        } catch (IOException e) {
//            HttpHeaders errorHeaders = new HttpHeaders();
//            errorHeaders.setContentType(new MediaType("text", "plain", StandardCharsets.UTF_8));
//            return new ResponseEntity<>("Lỗi khi lấy HTML từ URL: " + e.getMessage(), errorHeaders, HttpStatus.INTERNAL_SERVER_ERROR);
//        } catch (RuntimeException e) {
//            HttpHeaders errorHeaders = new HttpHeaders();
//            errorHeaders.setContentType(new MediaType("text", "plain", StandardCharsets.UTF_8));
//            return new ResponseEntity<>("Lỗi xử lý yêu cầu: " + e.getMessage(), errorHeaders, HttpStatus.BAD_REQUEST);
//        }
//    }
}