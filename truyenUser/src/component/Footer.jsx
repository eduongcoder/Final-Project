import React from "react";
// Import các icon từ lucide-react
import {
  Info,
  Compass,
  LifeBuoy,
  Search,
  Trophy,
  PenSquare, // Hoặc UploadCloud
  CreditCard,
  BookOpen,
  Wrench,
  MessageSquare,
  Users,
  Facebook,
  Send, // Tương tự TelegramPlane
  Mail
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 text-sm">
      <div className="container mx-auto p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

        {/* Giới thiệu */}
        <div>
          <h3 className="text-white font-semibold mb-4 flex items-center">
            <Info size={22} className="mr-2 text-blue-400" /> Giới Thiệu
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
            <Compass size={22} className="mr-2 text-green-400" /> Điều Hướng
          </h3>
          <ul className="space-y-2">
            <li className="flex items-center hover:text-white transition-colors cursor-pointer">
              <Search size={18} className="mr-2" /> Tìm kiếm
            </li>
            <li className="flex items-center hover:text-white transition-colors cursor-pointer">
              <Trophy size={18} className="mr-2" /> Bảng xếp hạng
            </li>
            <li className="flex items-center hover:text-white transition-colors cursor-pointer">
              <PenSquare size={18} className="mr-2" /> Đăng truyện
            </li>
            <li className="flex items-center hover:text-white transition-colors cursor-pointer">
              <CreditCard size={18} className="mr-2" /> Nạp vàng
            </li>
          </ul>
          <div className="flex space-x-3 mt-6">
            {/* Thay thế bằng ảnh thật hoặc component SVG nếu có */}
            <a href="#" aria-label="Google Play">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/2560px-Google_Play_Store_badge_EN.svg.png" alt="Google Play" className="h-10"/>
            </a>
            <a href="#" aria-label="App Store">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Download_on_the_App_Store_Badge.svg/2560px-Download_on_the_App_Store_Badge.svg.png" alt="App Store" className="h-10"/>
            </a>
          </div>
        </div>

        {/* Hỗ trợ */}
        <div>
          <h3 className="text-white font-semibold mb-4 flex items-center">
            <LifeBuoy size={22} className="mr-2 text-yellow-400" /> Hỗ Trợ
          </h3>
          <ul className="space-y-2">
            <li className="flex items-center hover:text-white transition-colors cursor-pointer">
              <BookOpen size={18} className="mr-2" /> Hướng dẫn
            </li>
            <li className="flex items-center hover:text-white transition-colors cursor-pointer">
              <Wrench size={18} className="mr-2" /> Các lỗi thường gặp
            </li>
            <li className="flex items-center hover:text-white transition-colors cursor-pointer">
              <MessageSquare size={18} className="mr-2" /> Chat với chúng tôi
            </li>
            <li className="flex items-center hover:text-white transition-colors cursor-pointer">
              <Users size={18} className="mr-2" /> Nhóm thảo luận
            </li>
          </ul>
        </div>
      </div>

      {/* Đường viền + bản quyền */}
      <div className="border-t border-gray-700 mt-8">
        <div className="container mx-auto p-4 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0 text-center md:text-left">
            2025 © truyenhdt.com All right services
            <a
              href="#" // Link tới trang DMCA
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 inline-block bg-gray-700 px-2 py-1 rounded text-xs hover:bg-gray-600 transition-colors"
            >
              DMCA PROTECTED
            </a>
          </div>

          {/* Link nhỏ và icon mạng xã hội */}
          <div className="flex flex-col md:flex-row items-center">
            <div className="flex space-x-2 text-gray-400 text-xs mb-3 md:mb-0 md:mr-6">
              <a href="#" className="hover:text-white transition-colors">About</a>
              <span className="select-none">-</span>
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <span className="select-none">-</span>
              <a href="#" className="hover:text-white transition-colors">TOS</a>
            </div>
            <div className="flex space-x-4 text-xl">
              <a href="#" aria-label="Telegram" className="hover:text-white transition-colors"><Send size={24} /></a>
              <a href="#" aria-label="Facebook" className="hover:text-white transition-colors"><Facebook size={24} /></a>
              <a href="#" aria-label="Email" className="hover:text-white transition-colors"><Mail size={24} /></a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;