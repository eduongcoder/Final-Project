package com.example.demo.service;

import org.jsoup.Connection;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.microsoft.playwright.Browser;
import com.microsoft.playwright.BrowserContext;
import com.microsoft.playwright.BrowserType;
import com.microsoft.playwright.Page;
import com.microsoft.playwright.Playwright;
import com.microsoft.playwright.PlaywrightException;
import com.microsoft.playwright.TimeoutError;
import com.microsoft.playwright.options.WaitForSelectorState;
import com.microsoft.playwright.options.WaitUntilState;

import java.io.IOException;
import java.util.Map;

@Service
public class HtmlFetcherService {

	private static final Logger logger = LoggerFactory.getLogger(HtmlFetcherService.class);

	// Một User-Agent hiện đại hơn
	private static final String DEFAULT_USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

	// Timeout cho việc tải trang và đợi các thành phần
	private static final int DEFAULT_PLAYWRIGHT_NAVIGATION_TIMEOUT_MILLIS = 60000; // 60 giây cho page.navigate()
	private static final int DEFAULT_PLAYWRIGHT_ACTION_TIMEOUT_MILLIS = 30000; // 30 giây cho các action khác như
																				// waitForSelector
    private static final int DEFAULT_PLAYWRIGHT_SELECTOR_TIMEOUT_MILLIS = 30000; // 30 giây cho đợi selector

	/**
	 * Lấy toàn bộ HTML của một URL sử dụng Playwright để thực thi JavaScript.
	 *
	 * @param url                          URL của trang web.
	 * @param attemptToRevealHiddenContent Nếu true, sẽ cố gắng thay đổi style của
	 *                                     các phần tử bị ẩn bởi data-x-show.
	 * @param userAgentToUse               User-Agent để sử dụng, nếu null hoặc rỗng
	 *                                     sẽ dùng default.
	 * @return Chuỗi HTML của trang.
	 * @throws IOException Nếu có lỗi trong quá trình lấy HTML.
	 */
	public String fetchFullHtml(String url, boolean attemptToRevealHiddenContent, String userAgentToUse)
			throws IOException {
		logger.info("Đang lấy HTML từ URL: {} (Playwright, revealHidden: {})", url, attemptToRevealHiddenContent);

		String effectiveUserAgent = (userAgentToUse != null && !userAgentToUse.isEmpty()) ? userAgentToUse
				: DEFAULT_USER_AGENT;

		// Khởi tạo Playwright. try-with-resources sẽ đảm bảo playwright.close() được
		// gọi.
		try (Playwright playwright = Playwright.create()) {
			// Khởi chạy trình duyệt (Chromium là một lựa chọn tốt, nhẹ)
			// Bạn cũng có thể thử playwright.firefox().launch() hoặc
			// playwright.webkit().launch()
			Browser browser = playwright.chromium().launch(new BrowserType.LaunchOptions().setHeadless(true) // true để
																												// chạy
																												// ngầm,
																												// false
																												// để
																												// thấy
																												// cửa
																												// sổ
																												// trình
																												// duyệt
																												// (dùng
																												// khi
																												// debug)
					// .setSlowMo(100) // Làm chậm thao tác (ms), hữu ích khi debug với
					// headless=false
					.setArgs(java.util.List.of("--disable-gpu", "--no-sandbox", "--disable-dev-shm-usage")) // Các cờ
																											// thường
																											// dùng cho
																											// môi
																											// trường
																											// server
			);

			// Tạo một context trình duyệt mới
			BrowserContext context = browser
					.newContext(new Browser.NewContextOptions().setUserAgent(effectiveUserAgent).setLocale("vi-VN") // Giả
																													// lập
																													// ngôn
																													// ngữ
																													// Việt
																													// Nam
							.setViewportSize(1920, 1080) // Giả lập kích thước màn hình
							.setJavaScriptEnabled(true) // Đảm bảo JavaScript được bật (mặc định là true)
					);

			// Mở một trang mới
			Page page = context.newPage();
			// Đặt timeout mặc định cho các thao tác trên page
			page.setDefaultNavigationTimeout(DEFAULT_PLAYWRIGHT_NAVIGATION_TIMEOUT_MILLIS);
			page.setDefaultTimeout(DEFAULT_PLAYWRIGHT_ACTION_TIMEOUT_MILLIS);

			try {
				logger.info("Playwright: Điều hướng tới {}", url);
				// Điều hướng tới URL và đợi cho đến khi network gần như không còn hoạt động
				// Hoặc bạn có thể dùng WaitUntilState.LOAD hoặc WaitUntilState.DOMCONTENTLOADED
				page.navigate(url, new Page.NavigateOptions().setWaitUntil(WaitUntilState.NETWORKIDLE));
				logger.info("Playwright: Điều hướng hoàn tất cho {}", url);

				// (Tùy chọn) Cố gắng hiển thị các phần tử bị ẩn bởi data-x-show
				if (attemptToRevealHiddenContent) {
					try {
						// Selector này nhắm vào các div có data-x-show và đang bị style="display: none"
						// Bạn có thể cần điều chỉnh selector này cho chính xác hơn
						String hiddenContentSelector = "div[data-x-show][style*='display:none']";
						int count = page.locator(hiddenContentSelector).count();
						if (count > 0) {
							logger.info(
									"Playwright: Tìm thấy {} phần tử có thể bị ẩn bởi data-x-show và style. Thử hiển thị...",
									count);
							page.evaluate("selector => {" + "  document.querySelectorAll(selector).forEach(el => {"
									+ "    el.style.display = 'block';" + // Hoặc el.style.removeProperty('display');
									"  });" + "}", hiddenContentSelector);
							page.waitForTimeout(500); // Đợi một chút để DOM cập nhật
							logger.info("Playwright: Đã thử hiển thị các phần tử bị ẩn.");
						}
					} catch (PlaywrightException e) {
						logger.warn("Playwright: Lỗi khi cố gắng hiển thị nội dung ẩn: {}", e.getMessage());
					}
				}

				// Đợi một selector quan trọng (ví dụ: vùng chứa nội dung chính) có nội dung
				// Điều này giúp đảm bảo JavaScript đã kịp render phần lớn nội dung.
				String criticalContentSelector = "div#chapter-content"; // Ví dụ cho metruyencv
				try {
					// Đợi cho đến khi phần tử này có ít nhất một thẻ con (không chỉ là text node
					// rỗng)
					page.waitForSelector(criticalContentSelector + " > *",
							new Page.WaitForSelectorOptions().setState(WaitForSelectorState.VISIBLE) // Đợi nó sichtbar
									.setTimeout(DEFAULT_PLAYWRIGHT_SELECTOR_TIMEOUT_MILLIS / 2.0) // Giảm timeout cho
																									// bước này một chút
					);
					logger.info("Playwright: Đã phát hiện thẻ con trong '{}' cho URL: {}", criticalContentSelector,
							url);
				} catch (TimeoutError e) {
					logger.warn(
							"Playwright: Timeout khi đợi '{}' có thẻ con. Trang có thể chưa tải hết nội dung động hoặc selector sai. Vẫn lấy HTML hiện tại.",
							criticalContentSelector, url);
					// (Tùy chọn) Chụp ảnh màn hình khi debug
					// try {
					// page.screenshot(new
					// Page.ScreenshotOptions().setPath(Paths.get("timeout_screenshot_" +
					// url.replaceAll("[^a-zA-Z0-9.-]", "_") + ".png")).setFullPage(true));
					// logger.info("Đã chụp ảnh màn hình vào: timeout_screenshot_{}.png",
					// url.replaceAll("[^a-zA-Z0-9.-]", "_"));
					// } catch (PlaywrightException screenshotEx) {
					// logger.error("Không thể chụp ảnh màn hình: {}", screenshotEx.getMessage());
					// }
				}

				// Lấy toàn bộ HTML của trang sau khi JavaScript đã chạy
				String pageSource = page.content();
				logger.info("Playwright: Lấy thành công page source, độ dài: {}", pageSource.length());
				return pageSource;

			} finally {
				// Đóng các tài nguyên một cách an toàn
				if (page != null) {
					try {
						page.close();
					} catch (PlaywrightException e) {
						logger.warn("Lỗi khi đóng page: {}", e.getMessage());
					}
				}
				if (context != null) {
					try {
						context.close();
					} catch (PlaywrightException e) {
						logger.warn("Lỗi khi đóng context: {}", e.getMessage());
					}
				}
				if (browser != null) {
					try {
						browser.close();
					} catch (PlaywrightException e) {
						logger.warn("Lỗi khi đóng browser: {}", e.getMessage());
					}
				}
			}
		} catch (PlaywrightException e) {
			logger.error("Lỗi Playwright nghiêm trọng khi xử lý URL {}: {}", url, e.getMessage(), e);
			throw new IOException("Lỗi Playwright khi lấy HTML từ: " + url + ". " + e.getMessage(), e);
		}
	}

	// Phương thức wrapper để gọi với cài đặt mặc định
	public String fetchFullHtml(String url) throws IOException {
		return fetchFullHtml(url, false, null); // Mặc định không thử thay đổi style và dùng UA default
	}

//    private static final Logger logger = LoggerFactory.getLogger(HtmlFetcherService.class);
//
//    private static final String DEFAULT_USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36";
//    private static final int DEFAULT_TIMEOUT = 15000; // 15 giây
//
//    public String fetchFullHtml(String url) throws IOException {
//        return fetchFullHtml(url, DEFAULT_USER_AGENT, null, DEFAULT_TIMEOUT);
//    }
//
//    public String fetchFullHtml(String url, String userAgent, Map<String, String> headers, int timeoutMillis) throws IOException {
//        logger.info("Đang lấy toàn bộ HTML từ URL: {}", url);
//        try {
//            Connection connection = Jsoup.connect(url);
//
//            if (userAgent != null && !userAgent.isEmpty()) {
//                connection.userAgent(userAgent);
//            } else {
//                connection.userAgent(DEFAULT_USER_AGENT);
//            }
//
//            if (headers != null && !headers.isEmpty()) {
//                connection.headers(headers);
//            }
//
//            connection.timeout(timeoutMillis > 0 ? timeoutMillis : DEFAULT_TIMEOUT);
//            connection.ignoreHttpErrors(true); // Quan trọng: để lấy cả trang lỗi (404, 500, ...) nếu có
//            connection.followRedirects(true); // Cho phép theo dõi chuyển hướng
//
//            Document doc = connection.get();
//
//            // Kiểm tra mã trạng thái HTTP (tùy chọn, để biết request có thành công không)
//            int statusCode = doc.connection().response().statusCode();
//            logger.info("URL: {}, Mã trạng thái HTTP: {}", url, statusCode);
//
//            // if (statusCode >= 200 && statusCode < 300) {
//            //     // Thành công
//            // } else {
//            //     // Có lỗi, bạn có thể muốn xử lý khác hoặc log thêm
//            //     logger.warn("Request tới {} trả về mã lỗi: {}", url, statusCode);
//            // }
//
//            return doc.outerHtml(); // Trả về toàn bộ HTML của trang, bao gồm cả thẻ <html>
//
//        } catch (IOException e) {
//            logger.error("Lỗi IOException khi lấy HTML từ {}: {}", url, e.getMessage());
//            throw new IOException("Lỗi khi kết nối hoặc đọc URL: " + url + ". " + e.getMessage(), e);
//        } catch (Exception e) {
//            logger.error("Lỗi không xác định khi lấy HTML từ {}: {}", url, e.getMessage(), e);
//            throw new RuntimeException("Lỗi không xác định khi lấy HTML từ: " + url + ". " + e.getMessage(), e);
//        }
//    }

}