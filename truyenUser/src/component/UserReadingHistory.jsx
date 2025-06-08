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
} from '../redux/userSlice'; // Sửa đường dẫn nếu cần
import { toast } from 'react-toastify';

// Hàm helper để chuyển mảng thời gian từ API thành đối tượng Date
const convertApiTimeToDate = (timeArray) => {
  if (!Array.isArray(timeArray) || timeArray.length < 6) {
    return null; // Hoặc trả về new Date() nếu muốn mặc định là thời gian hiện tại
  }
  // Format: [year, month, day, hour, minute, second, nanoseconds]
  // Lưu ý: Tháng trong JavaScript Date object là 0-indexed (0 = January, 1 = February, ...)
  return new Date(timeArray[0], timeArray[1] - 1, timeArray[2], timeArray[3], timeArray[4], timeArray[5]);
};


const formatTimeAgo = (dateObject) => {
  if (!dateObject || !(dateObject instanceof Date) || isNaN(dateObject.getTime())) {
      return 'Không rõ';
  }
  const now = new Date();
  const seconds = Math.round((now - dateObject) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);
  const months = Math.round(days / 30.44);
  const years = Math.round(days / 365.25);

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

  const [activeTab, setActiveTab] = useState('dangDoc');

  useEffect(() => {
    dispatch(clearUserError());
    dispatch(clearHistoryActionStatus());

    if (currentUser && currentUser.idUser) {
      if (activeTab === 'dangDoc') {
        dispatch(getAllHistoryByUser(currentUser.idUser));
      } else if (activeTab === 'danhDau') {
        console.log("Tab 'Đánh Dấu' được kích hoạt - cần logic riêng.");
      }
    }
  }, [dispatch, currentUser, activeTab]);

  useEffect(() => {
    if (historyActionStatus) {
      toast.success(historyActionStatus);
      dispatch(clearHistoryActionStatus());
      if (currentUser && currentUser.idUser && activeTab === 'dangDoc') {
        dispatch(getAllHistoryByUser(currentUser.idUser));
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
  };

  const mappedHistoryItems = userHistory
    .filter(item => {
      // Hiện tại chỉ hiển thị cho tab 'dangDoc'
      return activeTab === 'dangDoc';
    })
    .map(item => {
      // Kiểm tra xem item và item.id có tồn tại không
      if (!item || !item.id || !item.id.idNovel) {
        console.warn("History item is missing id or idNovel:", item);
        return null; // Bỏ qua item không hợp lệ
      }

      const novelId = item.id.idNovel;
      const chapterTitle = item.titleChapter || 'Chương ??';
      let chapterSlugPart = 'unknown-chapter';

      if (chapterTitle) {
        const match = chapterTitle.match(/Chương\s*(\d+)/i);
        if (match && match[1]) {
          chapterSlugPart = `${match[1]}`; // Chỉ lấy số chương
        } else {
          // Nếu không có "Chương X", tạo slug từ toàn bộ titleChapter
          chapterSlugPart = chapterTitle
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/\s+/g, '-')
            .replace(/[^\w-]+/g, '');
        }
      }

      const lastReadDate = convertApiTimeToDate(item.readingTime);

      return {
        // Sử dụng idNovel làm key vì nó là duy nhất cho mỗi truyện trong lịch sử của 1 user
        // Hoặc tạo key kết hợp nếu idUser cũng cần thiết cho key ở đây (thường không cần nếu map trong context của user)
        uniqueKey: `${item.id.idUser}-${novelId}`, // Key để React render list
        novelId: novelId,
        novelLink: `/novel/${novelId}`,
        // API của bạn không có ảnh bìa, cần lấy từ nơi khác hoặc dùng fallback
        coverImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(item.nameNovel ? item.nameNovel.charAt(0) : 'N')}&background=random&color=fff&size=96&font-size=0.5&length=1`,
        title: item.nameNovel || 'Tên truyện không xác định',
        currentChapterName: chapterTitle,
        // API của bạn không có tổng số chương, có thể để 'N/A'
        totalChapters: 'N/A', // Hoặc lấy từ state novel chi tiết nếu có
        // Link tới chương cụ thể, cần chapterId chứ không phải titleChapter
        // Giả sử bạn có chapterId hoặc một cách để lấy chapterId từ titleChapter
        // Hiện tại, dùng titleChapter để tạo slug tạm
        lastChapterLink: `/novel/${novelId}/chapter/${chapterSlugPart}`, // CẦN CẢI THIỆN LOGIC NÀY NẾU CÓ chapterId
        lastReadTimeFormatted: formatTimeAgo(lastReadDate),
        lastReadTimeRaw: lastReadDate // Giữ lại object Date gốc nếu cần sort
      };
    })
    .filter(item => item !== null); // Loại bỏ các item không hợp lệ đã được đánh dấu là null

  // Sắp xếp theo thời gian đọc gần nhất (nếu có)
  // mappedHistoryItems.sort((a, b) => (b.lastReadTimeRaw || 0) - (a.lastReadTimeRaw || 0));


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
        {/* Tabs */}
        <button
          onClick={() => setActiveTab('dangDoc')}
          className={`px-4 py-3 text-sm font-medium transition-colors duration-150 ${activeTab === 'dangDoc' ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
        >
          TRUYỆN ĐANG ĐỌC
        </button>
        <button
          onClick={() => setActiveTab('danhDau')}
          className={`px-4 py-3 text-sm font-medium transition-colors duration-150 ${activeTab === 'danhDau' ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
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

      {!isHistoryLoading && activeTab === 'dangDoc' && mappedHistoryItems.length === 0 && (
        <p className="text-center text-gray-500 dark:text-gray-400 py-8">
          Bạn chưa đọc truyện nào gần đây.
        </p>
      )}
       {!isHistoryLoading && activeTab === 'danhDau' && ( // Giả sử chưa có logic cho tab đánh dấu
        <p className="text-center text-gray-500 dark:text-gray-400 py-8">
          Bạn chưa đánh dấu truyện nào.
        </p>
      )}


      {!isHistoryLoading && activeTab === 'dangDoc' && mappedHistoryItems.length > 0 && (
        <div className="space-y-4">
          {mappedHistoryItems.map((item) => (
            <div
              key={item.uniqueKey} // Sử dụng uniqueKey
              className="flex flex-col sm:flex-row items-center p-4 bg-gray-50 dark:bg-slate-700/50 rounded-md shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <Link to={item.novelLink} className="flex-shrink-0 mb-3 sm:mb-0 sm:mr-4">
                <img
                  src={item.coverImage}
                  alt={item.title}
                  className="w-16 h-24 object-cover rounded"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.title ? item.title.charAt(0) : 'N')}&background=random&color=fff&size=96&font-size=0.5&length=1`;
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
                  Đã đọc đến: {item.currentChapterName}
                  {/* {item.totalChapters !== 'N/A' ? ` / ${item.totalChapters}` : ''} Bỏ totalChapters vì API không có */}
                </p>
                <Link
                  to={item.lastChapterLink} // Cần đảm bảo link này đúng
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-1 inline-block"
                >
                  Đọc tiếp {item.currentChapterName}
                </Link>
              </div>

              <div className="flex-shrink-0 mt-3 sm:mt-0 sm:ml-4 flex flex-col items-center sm:items-end space-y-1">
                <p className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
                  {item.lastReadTimeFormatted}
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