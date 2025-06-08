// Navbar.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // THÊM Link VÀ useNavigate
import { Search, UserCircle2, Settings, BookOpen, LogOut, User } from "lucide-react";
import AuthModal from './AuthModal';
import SettingsSidebar from './SettingsSidebar';
import { auth } from '../firebase-config';
import { onAuthStateChanged, signOut } from "firebase/auth";

// Hàm helper để tạo slug (ví dụ đơn giản)
const createSlug = (text) => {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD") // Chuẩn hóa Unicode (tách dấu)
    .replace(/[\u0300-\u036f]/g, "") // Loại bỏ dấu
    .replace(/\s+/g, '-') // Thay khoảng trắng bằng gạch ngang
    .replace(/[^\w-]+/g, '') // Loại bỏ các ký tự không phải chữ, số, gạch ngang
    .replace(/--+/g, '-') // Loại bỏ nhiều gạch ngang liên tiếp
    .replace(/^-+/, '') // Loại bỏ gạch ngang ở đầu
    .replace(/-+$/, ''); // Loại bỏ gạch ngang ở cuối
};


const menuItems = [
  {
    label: "Thể loại",
    basePath: "/category", // Thêm basePath cho từng loại menu
    subItems: ["Tiên Hiệp", "Huyền Huyễn", "Khoa Huyễn", "Đô Thị", "Đồng Nhân", "Dã Sử", "Kỳ Ảo", "Truyện Teen"]
  },
  {
    label: "Bối cảnh thế giới",
    basePath: "/world",
    subItems: ["Chư Thiên Vạn Giới", "Dị Tộc Luyện Tinh", "Tiên Lữ Kỳ Duyên", "Mạt Thế Nguy Cơ", "Hậu Môn Thế Gia"]
  },
  {
    label: "Lưu phái",
    basePath: "/style",
    subItems: ["Sau Màn", "Mỹ Thực", "Ngọt Sủng", "Xuyên Không", "Tùy Thân", "Bàn Thờ", "Hệ Thống"]
  },
  {
    label: "Danh sách",
    basePath: "/list",
    subItems: ["Truyện Dịch", "Truyện Convert", "Truyện Full", "Truyện Hot"]
  },
];

const Navbar = () => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isSettingsSidebarOpen, setSettingsSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate(); // SỬ DỤNG useNavigate cho tìm kiếm

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user ? user : null);
    });
    return () => unsubscribe();
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Điều hướng đến trang kết quả tìm kiếm, ví dụ: /search?q=ten_truyen
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery(""); // Xóa nội dung tìm kiếm sau khi điều hướng
      setIsSearchActive(false); // Có thể ẩn thanh tìm kiếm
    }
  };

  const handleAuthSuccess = (user) => {
    console.log("Authentication successful in Navbar for user:", user.email);
    setAuthModalOpen(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setSettingsSidebarOpen(false);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <div className="bg-blue-900 text-white">
      <div className="container mx-auto flex items-center justify-between py-4 px-6 relative">
        {/* Logo - THÊM Link ĐỂ VỀ TRANG CHỦ */}
        <Link to="/" className="flex items-center">
          <BookOpen className="text-2xl font-bold mr-2" size={28} />
          <span className="text-2xl font-bold">TRUYỆN CHỮ</span>
        </Link>

        {/* Menu */}
        <div className="hidden md:flex space-x-8">
          {menuItems.map((menu, index) => (
            <div
              key={index}
              className="relative group"
              onMouseEnter={() => setActiveMenu(index)}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <button className="hover:text-gray-300">{menu.label}</button>
              {activeMenu === index && (
                <div className="absolute top-full left-0 bg-blue-900 shadow-lg py-4 px-6 w-max z-20 grid grid-cols-2 gap-x-8 gap-y-3"> {/* Điều chỉnh gap */}
                  {menu.subItems.map((subItem, subIndex) => (
                    <Link // SỬ DỤNG Link THAY CHO a
                      key={subIndex}
                      to={`${menu.basePath}/${createSlug(subItem)}`} // TẠO ĐƯỜNG DẪN ĐỘNG
                      className="whitespace-nowrap hover:underline text-white"
                      onClick={() => setActiveMenu(null)} // Đóng menu khi click
                    >
                      {subItem}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Search Bar & Icons */}
        {/* ... (Phần tìm kiếm và icon user/settings giữ nguyên cách xử lý sự kiện, chỉ thay đổi điều hướng tìm kiếm) ... */}
         <div className="flex space-x-3 sm:space-x-4 items-center">
          {/* Tìm kiếm */}
          <div className="flex items-center w-32 sm:w-40 md:w-64 relative">
            {isSearchActive && (
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="px-3 sm:px-4 py-2 w-full bg-blue-800 text-white rounded-md placeholder-gray-300 text-sm"
                placeholder="Tìm kiếm..."
              />
            )}
            <Search
              className="text-lg sm:text-xl cursor-pointer hover:text-gray-300 absolute right-0 top-1/2 transform -translate-y-1/2 mr-2"
              size={18}
              onClick={() => {
                if (isSearchActive && searchQuery.trim()) {
                    handleSearch();
                } else {
                    setIsSearchActive(!isSearchActive);
                }
              }}
            />
          </div>

          {/* User & Settings Icons */}
          {currentUser ? (
            <div className="flex items-center space-x-2 sm:space-x-3">
              <span className="text-xs sm:text-sm hidden sm:block max-w-[100px] truncate" title={currentUser.displayName || currentUser.email}>
                {currentUser.displayName || currentUser.email?.split('@')[0]}
              </span>
              <button onClick={handleLogout} title="Đăng xuất" className="hover:text-red-400 transition-colors">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <UserCircle2
              className="text-lg sm:text-xl cursor-pointer hover:text-gray-300"
              size={20}
              onClick={() => setAuthModalOpen(true)}
              title="Đăng nhập / Đăng ký"
            />
          )}
          <Settings
            className="text-lg sm:text-xl cursor-pointer hover:text-gray-300"
            size={20}
            onClick={() => setSettingsSidebarOpen(true)}
            title="Cài đặt"
          />
        </div>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      <SettingsSidebar
        isOpen={isSettingsSidebarOpen}
        onClose={() => setSettingsSidebarOpen(false)}
        userLoggedIn={!!currentUser}
        username={currentUser?.displayName || currentUser?.email}
        onLogoutClick={handleLogout}
      />
    </div>
  );
};

export default Navbar;