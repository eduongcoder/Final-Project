// src/components/Sidebar/Sidebar.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
// UserReadingHistory không cần import ở đây nữa vì nó sẽ là một trang riêng
// import UserReadingHistory from './UserReadingHistory';
import { ChevronLeft, DollarSign, LogOut, Bell, MessageSquare, Menu, BookOpen, Repeat } from 'lucide-react'; // Thêm icon cho lịch sử

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleNavigateToDeposit = () => {
    navigate('/deposit');
    setIsSidebarOpen(false);
  };

  // THÊM: Hàm điều hướng đến trang lịch sử giao dịch
  const handleNavigateToTransactionHistory = () => {
    navigate('/user/transaction-history'); // Điều chỉnh route nếu cần
    setIsSidebarOpen(false);
  };

  // THÊM: Hàm điều hướng đến trang lịch sử đọc truyện
  const handleNavigateToReadingHistory = () => {
    navigate('/user/reading-history'); // Điều chỉnh route nếu cần
    setIsSidebarOpen(false);
  };

  const user = {
    name: "phantanthuvu@gmail.com",
    notifications: 0,
    messages: 0,
  };

  return (
    <>
      {!isSidebarOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 right-4 p-3 bg-gray-700 text-white rounded-full shadow-lg z-30 hover:bg-gray-600 transition-colors"
          aria-label="Mở menu"
        >
          <Menu size={24} />
        </button>
      )}

      <div
        className={`fixed top-0 right-0 h-full bg-white dark:bg-slate-900 shadow-xl transition-transform duration-300 ease-in-out z-40 ${
          isSidebarOpen ? 'translate-x-0 w-80' : 'translate-x-full w-0'
        } overflow-y-auto`}
      >
        {isSidebarOpen && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <FaUserCircle className="text-3xl text-gray-600 dark:text-gray-400" />
                <div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate max-w-[150px]">{user.name}</p>
                </div>
              </div>
              <button
                onClick={toggleSidebar}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                aria-label="Đóng menu"
              >
                <ChevronLeft size={24} />
              </button>
            </div>

            <button
              onClick={handleNavigateToDeposit}
              className="w-full bg-orange-500 text-white py-3 px-4 rounded-md hover:bg-orange-600 transition-colors flex items-center justify-center text-lg font-semibold mb-4 dark:bg-orange-600 dark:hover:bg-orange-700"
            >
              <DollarSign size={20} className="mr-2" /> Nạp
            </button>

            <div className="flex justify-around text-xs text-gray-600 dark:text-gray-400 mb-6">
                <button className="hover:text-orange-500 dark:hover:text-orange-400 flex items-center">
                    <Bell size={14} className="mr-1" /> {user.notifications} Thông báo
                </button>
                <button className="hover:text-orange-500 dark:hover:text-orange-400 flex items-center">
                    <MessageSquare size={14} className="mr-1" /> {user.messages} Tin nhắn
                </button>
            </div>

            <nav className="space-y-1">
              <button className="w-full text-left px-3 py-2.5 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300 transition-colors flex items-center">
                Nâng cấp tài khoản <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-sm ml-2">NEW</span>
              </button>
              <button className="w-full text-left px-3 py-2.5 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300 transition-colors flex items-center">Tủ truyện của tôi</button>
              
              {/* THAY ĐỔI: Button Lịch sử giao dịch */}
              <button
                onClick={handleNavigateToTransactionHistory}
                className="w-full text-left px-3 py-2.5 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300 transition-colors flex items-center"
              >
                <Repeat size={16} className="mr-2 text-gray-500 dark:text-gray-400" /> Lịch sử giao dịch
              </button>

              {/* THAY ĐỔI: Button Lịch sử đọc truyện */}
              <button
                onClick={handleNavigateToReadingHistory}
                className="w-full text-left px-3 py-2.5 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300 transition-colors flex items-center"
              >
                <BookOpen size={16} className="mr-2 text-gray-500 dark:text-gray-400" /> Lịch sử đọc truyện
              </button>

              <button className="w-full text-left px-3 py-2.5 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300 transition-colors flex items-center">Cài đặt cá nhân</button>
              <button className="w-full text-left px-3 py-2.5 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300 transition-colors flex items-center">Yêu cầu hỗ trợ</button>

              <div className="border-t border-gray-200 dark:border-slate-700 pt-3 mt-2">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase px-3 mb-1">Kho truyện</h3>
                <button className="w-full text-left px-3 py-2.5 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300 transition-colors flex items-center">Truyện mới</button>
                <button className="w-full text-left px-3 py-2.5 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300 transition-colors flex items-center">Truyện full</button>
              </div>

              <div className="border-t border-gray-200 dark:border-slate-700 pt-3 mt-2">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase px-3 mb-1">Xếp hạng</h3>
                <button className="w-full text-left px-3 py-2.5 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300 transition-colors flex items-center">Xếp hạng lượt đọc</button>
                <button className="w-full text-left px-3 py-2.5 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300 transition-colors flex items-center">Xếp hạng đề cử</button>
              </div>

              <div className="border-t border-gray-200 dark:border-slate-700 pt-3 mt-2">
                <button className="w-full text-left px-3 py-2.5 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300 transition-colors flex items-center">Thời gian thực</button>
                <button className="w-full text-left px-3 py-2.5 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300 transition-colors flex items-center">Đánh giá mới</button>
              </div>

              <div className="border-t border-gray-200 dark:border-slate-700 pt-3 mt-2">
                 <button className="w-full text-left px-3 py-2.5 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800 text-red-500 dark:text-red-400 transition-colors flex items-center">
                    <LogOut size={18} className="mr-2" /> Đăng xuất
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>

      {isSidebarOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          aria-hidden="true"
        ></div>
      )}
    </>
  );
};

export default Sidebar;