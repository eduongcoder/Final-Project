// src/pages/UserReadingHistoryPage.jsx
import React from 'react';
import UserReadingHistory from '../UserReadingHistory'; // Điều chỉnh đường dẫn này cho đúng
// Giả sử bạn có một component Layout chung hoặc cần thêm CSS cho trang
// import MainLayout from '../layouts/MainLayout';

const UserReadingHistoryPage = () => {
  return (
    // Nếu bạn có MainLayout, bạn có thể bọc component này:
    // <MainLayout>
    //   <div className="container mx-auto px-4 py-8">
    //     <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Lịch sử đọc truyện</h1>
    //     <UserReadingHistory />
    //   </div>
    // </MainLayout>

    // Hoặc đơn giản nếu không có Layout chung cho trang này:
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900 py-8">
      <div className="container mx-auto px-2 sm:px-4">
        {/* Bạn có thể thêm tiêu đề trang ở đây nếu muốn,
            ví dụ: lấy từ UserReadingHistory hoặc đặt cố định */}
        <UserReadingHistory />
      </div>
    </div>
  );
};

export default UserReadingHistoryPage;