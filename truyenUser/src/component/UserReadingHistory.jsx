// src/components/UserReadingHistory/UserReadingHistory.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBell, FaTimes, FaSortAmountUp } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAllHistoryByUser,
  deleteHistory,
  clearUserError,
  clearHistoryActionStatus
} from '../redux/userSlice'; // Đường dẫn tới userSlice
import { toast } from 'react-toastify';

// Hàm helper để định dạng thời gian "X thời gian trước"
const formatTimeAgo = (isoDateString) => {
  if (!isoDateString) return 'Không rõ';
  const date = new Date(isoDateString);
  const now = new Date();
  const seconds = Math.round((now - date) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);
  const months = Math.round(days / 30.44); // Trung bình số ngày trong tháng
  const years = Math.round(days / 365.25); // Tính cả năm nhuận

  if (seconds < 5) return 'vừa xong';
  if (seconds < 60) return `${seconds} giây trước`;
  if (minutes < 60) return `${minutes} phút trước`;
  if (hours < 24) return `${hours} giờ trước`;
  if (days < 30) return `${days} ngày trước`;
  if (months < 12) return `${months} tháng trước`;
  return `${years} năm trước`;
};

const UserReadingHistory = () => {
  const dispatch = useDispatch();
  const {
    currentUser,
    userHistory,
    isHistoryLoading,
    error: historyError,
    historyActionStatus
  } = useSelector((state) => state.user);

  const [activeTab, setActiveTab] = useState('dangDoc'); // 'dangDoc' hoặc 'danhDau'

  useEffect(() => {
    dispatch(clearUserError());
    dispatch(clearHistoryActionStatus());

    if (currentUser && currentUser.idUser) { // SỬ DỤNG currentUser.idUser
      if (activeTab === 'dangDoc') {
        dispatch(getAllHistoryByUser(currentUser.idUser)); // TRUYỀN currentUser.idUser
      } else if (activeTab === 'danhDau') {
        // TODO: Implement fetching/filtering for bookmarked items
        // Hiện tại, tab "Đánh Dấu" sẽ không hiển thị gì nếu API getAllHistoryByUser chỉ trả về lịch sử đang đọc.
        // Nếu API trả về cả hai loại và có trường phân biệt (ví dụ: item.type), bạn sẽ filter ở đây.
        // Hoặc bạn cần một API riêng cho truyện đánh dấu.
        console.log("Tab 'Đánh Dấu' được kích hoạt - cần logic riêng để tải hoặc lọc dữ liệu.");
        // Ví dụ: dispatch(getFavoriteNovels(currentUser.idUser));
      }
    }
  }, [dispatch, currentUser, activeTab]);

  useEffect(() => {
    if (historyActionStatus) {
      toast.success(historyActionStatus);
      dispatch(clearHistoryActionStatus());
      // Tải lại lịch sử sau khi có hành động (ví dụ: xóa) thành công
      if (currentUser && currentUser.idUser && activeTab === 'dangDoc') { // SỬ DỤNG currentUser.idUser
        dispatch(getAllHistoryByUser(currentUser.idUser)); // TRUYỀN currentUser.idUser
      }
    }
    if (historyError) {
      toast.error(`Lỗi lịch sử: ${historyError}`);
      dispatch(clearUserError());
    }
  }, [historyActionStatus, historyError, dispatch, currentUser, activeTab]);


  const handleRemoveItem = (idNovelToRemove) => {
    if (currentUser && currentUser.idUser && idNovelToRemove) {
      dispatch(deleteHistory({ idUser: currentUser.idUser, idNovel: idNovelToRemove }));
    } else {
      toast.error("Không thể xóa: thiếu thông tin người dùng hoặc truyện.");
    }
  };

  const handleToggleNotification = (novelId) => {
    console.log(`Bật/tắt thông báo cho truyện ID: ${novelId}`);
    toast.info("Chức năng thông báo đang được phát triển!");
    // TODO: Gọi API để bật/tắt thông báo cho novelId
  };

  const mappedHistoryItems = userHistory
    .filter(item => {
      // Nếu bạn muốn phân biệt giữa 'Đang đọc' và 'Đánh dấu' và API getAllHistoryByUser trả về cả hai
      // với một trường 'type' (ví dụ: 'reading', 'bookmarked'), bạn có thể filter ở đây.
      // if (activeTab === 'dangDoc') return item.type === 'reading' || !item.type; // Mặc định là đang đọc nếu không có type
      // if (activeTab === 'danhDau') return item.type === 'bookmarked';
      // return true; // Nếu không có filter theo type, hiển thị tất cả
      return true; // Hiện tại, giả sử getAllHistoryByUser chỉ lấy 'Đang đọc' khi activeTab là 'dangDoc'
    })
    .map(item => {
      let chapterSlug = 'unknown';
      if (item.nameChapter) {
        const match = item.nameChapter.match(/Chương\s*(\d+)/i);
        if (match && match[1]) {
          chapterSlug = `chuong-${match[1]}`;
        } else {
          chapterSlug = item.nameChapter
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]+/g, ''); // \w bao gồm chữ, số, dấu gạch dưới
        }
      }

      return {
        id: item.idHistory,
        novelId: item.idNovel,
        novelLink: `/novel/${item.idNovel}`,
        coverImage: item.novelImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.novelName || 'N')}&background=random&size=64&length=1`, // Ảnh từ API hoặc ảnh fallback
        title: item.novelName || 'Tên truyện không xác định',
        currentChapterName: item.nameChapter || 'Chương ??',
        totalChapters: item.novelTotalChapter || 'N/A',
        lastChapterLink: `/novel/${item.idNovel}/chapter/${chapterSlug}`,
        lastReadTime: item.updatedAt || item.createdAt,
      };
    });

  if (!currentUser) {
    return (
      <div className="container mx-auto my-8 p-6 bg-white dark:bg-slate-800 shadow-xl rounded-lg text-center">
        <p className="text-gray-600 dark:text-gray-300">
          Vui lòng <Link to="/login" className="text-blue-500 hover:underline">đăng nhập</Link> để xem lịch sử đọc truyện.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto my-8 p-4 sm:p-6 bg-white dark:bg-slate-800 shadow-xl rounded-lg">
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

      {isHistoryLoading && (
        <p className="text-center text-gray-500 dark:text-gray-400 py-8">Đang tải lịch sử...</p>
      )}

      {!isHistoryLoading && mappedHistoryItems.length === 0 && (
        <p className="text-center text-gray-500 dark:text-gray-400 py-8">
          {activeTab === 'dangDoc' ? 'Bạn chưa đọc truyện nào gần đây.' : 'Bạn chưa đánh dấu truyện nào.'}
        </p>
      )}

      {!isHistoryLoading && mappedHistoryItems.length > 0 && (
        <div className="space-y-4">
          {mappedHistoryItems.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row items-center p-4 bg-gray-50 dark:bg-slate-700/50 rounded-md shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <Link to={item.novelLink} className="flex-shrink-0 mb-3 sm:mb-0 sm:mr-4">
                <img
                  src={item.coverImage}
                  alt={item.title}
                  className="w-16 h-24 object-cover rounded"
                  onError={(e) => {
                    e.target.onerror = null;
                    // Fallback image nếu ảnh từ API lỗi, có thể dùng ui-avatars hoặc placeholder khác
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.title.charAt(0))}&background=random&color=fff&size=64&font-size=0.5&length=1`;
                  }}
                />
              </Link>

              <div className="flex-grow text-center sm:text-left">
                <Link to={item.novelLink} className="hover:underline">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1 line-clamp-1 sm:line-clamp-2" title={item.title}>
                    {item.title}
                  </h3>
                </Link>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Đã đọc đến: {item.currentChapterName} {item.totalChapters !== 'N/A' ? `/ ${item.totalChapters}` : ''}
                </p>
                <Link
                  to={item.lastChapterLink}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-1 inline-block"
                >
                  Đọc tiếp {item.currentChapterName}
                </Link>
              </div>

              <div className="flex-shrink-0 mt-3 sm:mt-0 sm:ml-4 flex flex-col items-center sm:items-end space-y-1">
                <p className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
                  {formatTimeAgo(item.lastReadTime)}
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleToggleNotification(item.novelId)}
                    className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors"
                    title="Thông báo chương mới"
                  >
                    <FaBell size={16} />
                  </button>
                  <button
                    onClick={() => handleRemoveItem(item.novelId)}
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