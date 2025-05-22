// Navbar.js
import React, { useState, useEffect } from "react"; // Thêm useEffect
import { Search, UserCircle2, Settings, BookOpen, LogOut, User } from "lucide-react"; // Thêm LogOut, User
import AuthModal from './AuthModal';
import SettingsSidebar from './SettingsSidebar';
import { auth } from '../firebase-config'; // Import auth từ Firebase config
import { onAuthStateChanged, signOut } from "firebase/auth"; // Import các hàm cần thiết

const menuItems = [
  {
    label: "Thể loại",
    subItems: ["Tiên Hiệp", "Huyền Huyễn", "Khoa Huyễn", "Đô Thị", "Đồng Nhân", "Dã Sử", "Kỳ Ảo", "Truyện Teen"]
  },
  {
    label: "Bối cảnh thế giới",
    subItems: ["Chư Thiên Vạn Giới", "Dị Tộc Luyện Tinh", "Tiên Lữ Kỳ Duyên", "Mạt Thế Nguy Cơ", "Hậu Môn Thế Gia"]
  },
  {
    label: "Lưu phái",
    subItems: ["Sau Màn", "Mỹ Thực", "Ngọt Sủng", "Xuyên Không", "Tùy Thân", "Bàn Thờ", "Hệ Thống"]
  },
  {
    label: "Danh sách",
    subItems: ["Truyện Dịch", "Truyện Convert", "Truyện Full", "Truyện Hot"]
  },
];

const Navbar = () => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false); // Đổi tên state cho AuthModal
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isSettingsSidebarOpen, setSettingsSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); // State cho người dùng hiện tại (từ Firebase)

  // Lắng nghe thay đổi trạng thái đăng nhập của Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Người dùng đã đăng nhập
        setCurrentUser(user);
        console.log("User is signed in:", user);
      } else {
        // Người dùng đã đăng xuất
        setCurrentUser(null);
        console.log("User is signed out");
      }
    });

    // Cleanup subscription khi component unmount
    return () => unsubscribe();
  }, []); // Chạy một lần khi component mount

  const handleSearch = () => {
    if (searchQuery) {
      alert(`Tìm kiếm truyện: ${searchQuery}`);
      // Thêm logic tìm kiếm truyện ở đây
    }
  };

  const handleAuthSuccess = (user) => {
    // onAuthStateChanged đã xử lý việc cập nhật currentUser
    // Bạn có thể làm thêm gì đó ở đây nếu cần, ví dụ: đóng modal
    console.log("Authentication successful in Navbar for user:", user.email);
    setAuthModalOpen(false); // Đảm bảo modal đóng sau khi thành công
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // onAuthStateChanged sẽ tự động cập nhật currentUser thành null
      console.log("User signed out successfully");
      setSettingsSidebarOpen(false); // Đóng sidebar cài đặt nếu đang mở
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <div className="bg-blue-900 text-white">
      <div className="container mx-auto flex items-center justify-between py-4 px-6 relative">

        {/* Logo */}
        <div className="flex items-center">
          <BookOpen className="text-2xl font-bold mr-2" size={28} />
          <span className="text-2xl font-bold">TRUYỆN CHỮ</span>
        </div>

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
                <div className="absolute top-full left-0 bg-blue-900 shadow-lg py-4 px-6 w-max z-20 grid grid-cols-2 gap-6">
                  {menu.subItems.map((subItem, subIndex) => (
                    <a
                      key={subIndex}
                      href="#"
                      className="whitespace-nowrap hover:underline text-white"
                    >
                      {subItem}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Search Bar & Icons */}
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
              size={18} // Giảm size một chút cho search icon
              onClick={() => setIsSearchActive(!isSearchActive)}
            />
          </div>

          {/* User & Settings Icons */}
          {currentUser ? (
            // Nếu đã đăng nhập, hiển thị tên và nút Logout
            <div className="flex items-center space-x-2 sm:space-x-3">
              <span className="text-xs sm:text-sm hidden sm:block max-w-[100px] truncate" title={currentUser.displayName || currentUser.email}>
                {currentUser.displayName || currentUser.email?.split('@')[0]}
              </span>
              {/* Có thể thêm icon User nhỏ ở đây nếu muốn */}
              {/* <User size={18} className="text-gray-300" /> */}
              <button onClick={handleLogout} title="Đăng xuất" className="hover:text-red-400 transition-colors">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            // Nếu chưa đăng nhập, hiển thị icon UserCircle để mở AuthModal
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

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess} // Truyền hàm callback
      />

      {/* Settings Sidebar */}
      <SettingsSidebar
        isOpen={isSettingsSidebarOpen}
        onClose={() => setSettingsSidebarOpen(false)}
        userLoggedIn={!!currentUser} // Chuyển currentUser thành boolean
        username={currentUser?.displayName || currentUser?.email} // Truyền tên người dùng (nếu có)
        onLogoutClick={handleLogout} // Truyền hàm logout cho sidebar nếu cần
      />
    </div>
  );
};

export default Navbar;