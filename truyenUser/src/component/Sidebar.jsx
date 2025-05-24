// src/components/Sidebar/Sidebar.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // THÊM: Import useNavigate
import { FaUserCircle } from 'react-icons/fa';
// THÊM: Menu icon, các icon khác đã có
import { ChevronLeft, DollarSign, LogOut, Bell, MessageSquare, Menu } from 'lucide-react';
// XÓA: không import DepositModal ở đây nữa
// import DepositModal from './DepositModal';

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // XÓA: State cho modal nạp tiền không còn cần thiết ở đây
  // const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const navigate = useNavigate(); // THÊM: Sử dụng hook useNavigate

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // THÊM: Hàm này sẽ điều hướng đến trang nạp tiền
  const handleNavigateToDeposit = () => {
    navigate('/deposit'); // Điều hướng đến route /deposit
    setIsSidebarOpen(false); // Tùy chọn: Đóng sidebar sau khi nhấp
  };

  // XÓA: Các hàm open/close modal không cần nữa
  // const openDepositModal = () => { ... };
  // const closeDepositModal = () => { ... };

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
          // THAY ĐỔI: Tăng z-index để nút hamburger luôn ở trên khi sidebar đóng
          className="fixed top-4 right-4 p-3 bg-gray-700 text-white rounded-full shadow-lg z-30 hover:bg-gray-600 transition-colors"
          aria-label="Mở menu"
        >
          {/* THAY ĐỔI: Sử dụng Menu icon từ Lucide */}
          <Menu size={24} />
        </button>
      )}

      <div
        // THAY ĐỔI: Tăng z-index để sidebar ở trên overlay
        className={`fixed top-0 right-0 h-full bg-white shadow-xl transition-transform duration-300 ease-in-out z-40 ${
          isSidebarOpen ? 'translate-x-0 w-80' : 'translate-x-full w-0'
        } overflow-y-auto`}
      >
        {isSidebarOpen && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <FaUserCircle className="text-3xl text-gray-600" />
                <div>
                  <p className="text-sm font-semibold text-gray-800 truncate max-w-[150px]">{user.name}</p>
                </div>
              </div>
              <button
                onClick={toggleSidebar}
                className="text-gray-600 hover:text-gray-800"
                aria-label="Đóng menu"
              >
                <ChevronLeft size={24} />
              </button>
            </div>

            <button
              // THAY ĐỔI: Gọi hàm điều hướng
              onClick={handleNavigateToDeposit}
              className="w-full bg-orange-500 text-white py-3 px-4 rounded-md hover:bg-orange-600 transition-colors flex items-center justify-center text-lg font-semibold mb-4"
            >
              <DollarSign size={20} className="mr-2" /> Nạp
            </button>
            
            <div className="flex justify-around text-xs text-gray-600 mb-6">
                <button className="hover:text-orange-500 flex items-center">
                    <Bell size={14} className="mr-1" /> {user.notifications} Thông báo
                </button>
                <button className="hover:text-orange-500 flex items-center">
                    <MessageSquare size={14} className="mr-1" /> {user.messages} Tin nhắn
                </button>
            </div>

            <nav className="space-y-3">
              <button className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 transition-colors">
                Nâng cấp tài khoản <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-sm ml-2">NEW</span>
              </button>
              <button className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 transition-colors">Tủ truyện của tôi</button>
              <button className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 transition-colors">Lịch sử giao dịch</button>
              <button className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 transition-colors">Cài đặt cá nhân</button>
              <button className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 transition-colors">Yêu cầu hỗ trợ</button>
            
              <div className="border-t border-gray-200 pt-3">
                <h3 className="text-xs font-semibold text-gray-500 uppercase px-3 mb-1">Kho truyện</h3>
                <button className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 transition-colors">Truyện mới</button>
                <button className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 transition-colors">Truyện full</button>
              </div>

              <div className="border-t border-gray-200 pt-3">
                <h3 className="text-xs font-semibold text-gray-500 uppercase px-3 mb-1">Xếp hạng</h3>
                <button className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 transition-colors">Xếp hạng lượt đọc</button>
                <button className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 transition-colors">Xếp hạng đề cử</button>
              </div>

              <div className="border-t border-gray-200 pt-3">
                <button className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 transition-colors">Thời gian thực</button>
                <button className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700 transition-colors">Đánh giá mới</button>
              </div>
              
              <div className="border-t border-gray-200 pt-3">
                 <button className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 text-red-500 transition-colors flex items-center">
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
          // THAY ĐỔI: z-index thấp hơn sidebar nhưng vẫn trên nội dung chính
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          aria-hidden="true"
        ></div>
      )}

      {/* XÓA: Không render DepositModal ở đây nữa */}
      {/* <DepositModal isOpen={isDepositModalOpen} onClose={closeDepositModal} /> */}
    </>
  );
};

export default Sidebar;