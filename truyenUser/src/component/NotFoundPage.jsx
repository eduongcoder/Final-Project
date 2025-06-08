// src/pages/NotFoundPage.jsx (hoặc bất kỳ đường dẫn nào bạn muốn đặt)
import React from 'react';
import { Link } from 'react-router-dom';
// Bạn có thể import một icon hoặc hình ảnh vui nhộn cho trang 404
// import { FaExclamationTriangle } from 'react-icons/fa';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800 p-6">
      <div className="text-center">
        {/* Tùy chọn: Thêm icon */}
        {/* <FaExclamationTriangle className="text-yellow-500 text-6xl mb-4" /> */}

        <h1 className="text-6xl font-bold text-sky-600 mb-4">404</h1>
        <h2 className="text-3xl font-semibold mb-3">Trang không tồn tại</h2>
        <p className="text-lg text-gray-600 mb-8">
          Xin lỗi, chúng tôi không thể tìm thấy trang bạn đang tìm kiếm.
          <br />
          Có thể trang đã bị xóa, đổi tên hoặc tạm thời không khả dụng.
        </p>
        <Link
          to="/"
          className="px-6 py-3 bg-sky-600 text-white font-semibold rounded-lg shadow-md hover:bg-sky-700 transition duration-300 ease-in-out transform hover:scale-105"
        >
          Quay về Trang Chủ
        </Link>
        <p className="mt-10 text-sm text-gray-500">
          Nếu bạn nghĩ đây là một lỗi, vui lòng liên hệ với quản trị viên.
        </p>
      </div>
    </div>
  );
};

export default NotFoundPage;