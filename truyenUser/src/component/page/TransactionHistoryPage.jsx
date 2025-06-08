// src/pages/UserTransactionHistoryPage.jsx
import React from 'react';
import UserTransactionHistory from '../UserTransactionHistory'; // Điều chỉnh đường dẫn này cho đúng
// import MainLayout from '../layouts/MainLayout';

const UserTransactionHistoryPage = () => {
  return (
    // Tương tự, bạn có thể dùng MainLayout ở đây
    // <MainLayout>
    //   <div className="container mx-auto px-4 py-8">
    //     <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Lịch sử giao dịch</h1>
    //     <UserTransactionHistory />
    //   </div>
    // </MainLayout>

    <div className="min-h-screen bg-gray-100 dark:bg-slate-900 py-8">
      <div className="container mx-auto px-2 sm:px-4">
        <UserTransactionHistory />
      </div>
    </div>
  );
};

export default UserTransactionHistoryPage;