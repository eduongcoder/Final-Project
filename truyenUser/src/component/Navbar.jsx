import React, { useState } from "react";
import { FaSearch, FaUserCircle, FaCog } from "react-icons/fa";
import LoginModal from './LoginModal';

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
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false); // Trạng thái cho input tìm kiếm

  const handleSearch = () => {
    if (searchQuery) {
      alert(`Tìm kiếm truyện: ${searchQuery}`);
      // Thêm logic tìm kiếm truyện ở đây
    }
  };

  return (
    <div className="bg-blue-900 text-white">
      <div className="container mx-auto flex items-center justify-between py-4 px-6 relative">

        {/* Logo */}
        <div className="flex items-center">
          <div className="text-2xl font-bold mr-2">📖</div>
          <span className="text-2xl font-bold">TRUYỆN CHỮ</span>
        </div>

        {/* Menu */}
        <div className="flex space-x-8">
          {menuItems.map((menu, index) => (
            <div
              key={index}
              className="relative group"
              onMouseEnter={() => setActiveMenu(index)}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <button className="hover:text-gray-300">{menu.label}</button>

              {activeMenu === index && (
                <div className="absolute top-full left-0 bg-blue-900 shadow-lg py-4 px-6 w-max z-10 grid grid-cols-2 gap-6">
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
        <div className="flex space-x-4 items-center">
          {/* Tìm kiếm */}
          <div className="flex items-center w-64 relative">
            {isSearchActive && (
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="px-4 py-2 w-full bg-blue-800 text-white rounded-md"
                placeholder="Tìm kiếm..."
              />
            )}
            <FaSearch
              className="text-xl cursor-pointer hover:text-gray-300 absolute right-0 top-1/2 transform -translate-y-1/2 mr-2"
              onClick={() => setIsSearchActive(!isSearchActive)} // Toggle input khi click vào icon
            />
          </div>

          {/* User & Settings Icons */}
          <FaUserCircle
            className="text-xl cursor-pointer hover:text-gray-300"
            onClick={() => setLoginOpen(true)}
          />
          <FaCog className="text-xl cursor-pointer hover:text-gray-300" />
        </div>
      </div>

      {/* Modal Login */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setLoginOpen(false)} />
    </div>
  );
};

export default Navbar;
