import React from "react";
import { FaFacebook, FaTelegramPlane, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 text-sm">
      <div className="container mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Giới thiệu */}
        <div>
          <h3 className="text-white font-semibold mb-4 flex items-center">
            <span className="mr-2">ℹ️</span> Giới Thiệu
          </h3>
          <p className="mb-4">
            Đọc truyện online, truyện full, truyện hay được đóng góp bởi cộng đồng thành viên. 
            Web luôn cập nhật những bộ truyện mới thuộc các thể loại ngôn tình, đam mỹ, bách hợp...
          </p>
          <p>
            Tất cả nội dung tuân thủ luật pháp và bị xóa nếu vi phạm. Bản quyền thuộc về tác giả gốc.
          </p>
        </div>

        {/* Điều hướng */}
        <div>
          <h3 className="text-white font-semibold mb-4 flex items-center">
            <span className="mr-2">➕</span> Điều Hướng
          </h3>
          <ul className="space-y-2">
            <li>🔍 Tìm kiếm</li>
            <li>🏆 Bảng xếp hạng</li>
            <li>📤 Đăng truyện</li>
            <li>💳 Nạp vàng</li>
          </ul>
          <div className="flex space-x-2 mt-4">
            <img src="/path-googleplay.png" alt="Google Play" className="h-10"/>
            <img src="/path-appstore.png" alt="App Store" className="h-10"/>
          </div>
        </div>

        {/* Hỗ trợ */}
        <div>
          <h3 className="text-white font-semibold mb-4 flex items-center">
            <span className="mr-2">☺️</span> Hỗ Trợ
          </h3>
          <ul className="space-y-2">
            <li>📚 Hướng dẫn</li>
            <li>🛠 Các lỗi thường gặp</li>
            <li>💬 Chat với chúng tôi</li>
            <li>👥 Nhóm thảo luận</li>
          </ul>
        </div>
      </div>

      {/* Đường viền + bản quyền */}
      <div className="border-t border-gray-700 mt-8">
        <div className="container mx-auto p-4 flex flex-col md:flex-row justify-between items-center">
          <div>
            2025 © truyenhdt.com All right services
            <span className="ml-2 inline-block bg-gray-700 px-2 py-1 rounded text-xs">DMCA PROTECTED</span>
          </div>

          {/* Link nhỏ và icon mạng xã hội */}
          <div className="flex flex-col md:flex-row md:space-x-6 items-center mt-4 md:mt-0">
            <div className="flex space-x-2 text-gray-400 text-xs mb-2 md:mb-0">
              <a href="#" className="hover:text-white">About</a> -
              <a href="#" className="hover:text-white">Privacy Policy</a> -
              <a href="#" className="hover:text-white">TOS</a>
            </div>
            <div className="flex space-x-4 text-xl">
              <a href="#"><FaTelegramPlane className="hover:text-white" /></a>
              <a href="#"><FaFacebook className="hover:text-white" /></a>
              <a href="#"><FaEnvelope className="hover:text-white" /></a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
