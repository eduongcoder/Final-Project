// src/components/UserReadingHistory/UserReadingHistory.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Giả sử bạn dùng React Router
import { FaBell, FaTimes, FaSortAmountUp } from 'react-icons/fa'; // Icons
import { mockReadingHistory } from '../data/mockReadingHistory'; // Import mock data

// Hàm helper để định dạng thời gian "X thời gian trước"
const formatTimeAgo = (isoDateString) => {
  const date = new Date(isoDateString);
  const now = new Date();
  const seconds = Math.round((now - date) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);
  const months = Math.round(days / 30.44); // Trung bình số ngày trong tháng
  const years = Math.round(days / 365.25); // Tính cả năm nhuận

  if (seconds < 60) return `${seconds} giây trước`;
  if (minutes < 60) return `${minutes} phút trước`;
  if (hours < 24) return `${hours} giờ trước`;
  if (days < 30) return `${days} ngày trước`;
  if (months < 12) return `${months} tháng trước`;
  return `${years} năm trước`;
};


const UserReadingHistory = () => {
  const [activeTab, setActiveTab] = useState('dangDoc'); // 'dangDoc' hoặc 'danhDau'
  const [historyItems, setHistoryItems] = useState([]);

  useEffect(() => {
    // Trong thực tế, bạn sẽ fetch dữ liệu từ API ở đây
    // Ví dụ: if (activeTab === 'dangDoc') fetchCurrentlyReading();
    //         else fetchBookmarked();
    setHistoryItems(mockReadingHistory); // Sử dụng mock data
  }, [activeTab]);

  const handleRemoveItem = (itemId) => {
    // Xử lý xóa item khỏi lịch sử (gọi API, cập nhật state)
    setHistoryItems(prevItems => prevItems.filter(item => item.id !== itemId));
    console.log(`Xóa truyện có ID: ${itemId}`);
  };

  const handleToggleNotification = (itemId) => {
    // Xử lý bật/tắt thông báo cho truyện (gọi API, cập nhật state)
    console.log(`Bật/tắt thông báo cho truyện ID: ${itemId}`);
    // Ví dụ cập nhật trạng thái icon (nếu có)
  };

  return (
    <div className="container mx-auto my-8 p-4 sm:p-6 bg-white dark:bg-slate-800 shadow-xl rounded-lg">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-slate-700 mb-6">
        <button
          onClick={() => setActiveTab('dangDoc')}
          className={`px-4 py-3 text-sm font-medium transition-colors duration-150
            ${activeTab === 'dangDoc'
              ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
        >
          TRUYỆN ĐANG ĐỌC
        </button>
        <button
          onClick={() => setActiveTab('danhDau')}
          className={`px-4 py-3 text-sm font-medium transition-colors duration-150
            ${activeTab === 'danhDau'
              ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
        >
          TRUYỆN ĐÁNH DẤU
        </button>
        <div className="ml-auto flex items-center">
            <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200" title="Sắp xếp">
                <FaSortAmountUp size={18} />
            </button>
        </div>
      </div>

      {/* Danh sách truyện */}
      {historyItems.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400 py-8">
          {activeTab === 'dangDoc' ? 'Bạn chưa đọc truyện nào gần đây.' : 'Bạn chưa đánh dấu truyện nào.'}
        </p>
      ) : (
        <div className="space-y-4">
          {historyItems.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row items-center p-4 bg-gray-50 dark:bg-slate-700/50 rounded-md shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <Link to={item.novelLink} className="flex-shrink-0 mb-3 sm:mb-0 sm:mr-4">
                <img
                  src={item.coverImage}
                  alt={item.title}
                  className="w-16 h-24 object-cover rounded"
                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/64x96.png?text=No+Image'; }} // Fallback image
                />
              </Link>

              <div className="flex-grow text-center sm:text-left">
                <Link to={item.novelLink} className="hover:underline">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1 line-clamp-1 sm:line-clamp-2" title={item.title}>
                    {item.title}
                  </h3>
                </Link>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Đã đọc: {item.currentChapter}/{item.totalChapters}
                </p>
                <Link
                  to={item.lastChapterLink}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-1 inline-block"
                >
                  Đọc tiếp chương {item.currentChapter}
                </Link>
              </div>

              <div className="flex-shrink-0 mt-3 sm:mt-0 sm:ml-4 flex flex-col items-center sm:items-end space-y-1">
                <p className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
                  {formatTimeAgo(item.lastReadTime)}
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleToggleNotification(item.id)}
                    className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors"
                    title="Thông báo chương mới"
                  >
                    <FaBell size={16} />
                  </button>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                    title="Xóa khỏi lịch sử"
                  >
                    <FaTimes size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserReadingHistory;