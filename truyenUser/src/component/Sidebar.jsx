import React, { useState } from 'react';
import { FaChevronLeft } from 'react-icons/fa';

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="relative">
      {/* Nút để mở thanh tùy chọn */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 p-4 bg-yellow-500 text-white rounded-full shadow-lg z-10"
      >
        <span className="text-xl">☰</span>
      </button>

      {/* Sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 z-20">
          <div className="fixed top-0 left-0 bg-white w-80 h-full shadow-lg p-6">
            <button
              onClick={toggleSidebar}
              className="absolute top-4 right-4 text-2xl text-gray-700"
            >
              <FaChevronLeft />
            </button>

            <h2 className="text-xl font-semibold text-gray-800 mb-6">rRykZ12773</h2>

            <div className="space-y-6">
              {/* Nâng cấp tài khoản */}
              <div className="flex flex-col space-y-2">
                <button className="text-lg text-gray-800">Nâng cấp tài khoản</button>
                <button className="text-lg text-gray-800">Tủ truyện của tôi</button>
                <button className="text-lg text-gray-800">Lịch sử giao dịch</button>
                <button className="text-lg text-gray-800">Cài đặt cá nhân</button>
                <button className="text-lg text-gray-800">Yêu cầu hỗ trợ</button>
              </div>

              <div className="border-t border-gray-300 pt-6">
                <h3 className="text-lg font-semibold text-gray-800">Kho truyện</h3>
                <ul className="mt-2 space-y-2">
                  <li><button className="text-gray-800">Truyện mới</button></li>
                  <li><button className="text-gray-800">Truyện full</button></li>
                </ul>
              </div>

              <div className="border-t border-gray-300 pt-6">
                <h3 className="text-lg font-semibold text-gray-800">Xếp hạng</h3>
                <ul className="mt-2 space-y-2">
                  <li><button className="text-gray-800">Xếp hạng lượt đọc</button></li>
                  <li><button className="text-gray-800">Xếp hạng đề cử</button></li>
                  <li><button className="text-gray-800">Xếp hạng tăng thường</button></li>
                  <li><button className="text-gray-800">Xếp hạng bình luận</button></li>
                </ul>
              </div>

              <div className="border-t border-gray-300 pt-6">
                <button className="text-lg text-gray-800">Thời gian thực</button>
                <button className="text-lg text-gray-800">Đánh giá mới</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
