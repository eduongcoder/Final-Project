// GoToChapterInput.jsx
import React, { useState } from 'react';

const GoToChapterInput = ({ onGoToChapter }) => {
  const [chapterNumber, setChapterNumber] = useState('');

  const handleInputChange = (event) => {
    setChapterNumber(event.target.value);
  };

  const handleGoClick = () => {
    if (chapterNumber.trim() !== '' && !isNaN(chapterNumber)) {
      onGoToChapter(parseInt(chapterNumber, 10));
      // Bạn có thể muốn xóa input sau khi nhấn "Đi" hoặc không, tùy theo UX
      // setChapterNumber(''); 
    } else {
      // Có thể thêm thông báo lỗi nếu input không hợp lệ
      console.warn("Vui lòng nhập một số chương hợp lệ.");
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleGoClick();
    }
  };

  return (
    <div className="flex items-center">
      <input
        type="number" // Sử dụng type="number" để bàn phím số hiện trên mobile
        value={chapterNumber}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Nhập số chương"
        className="bg-[#363942] text-gray-200 px-3 py-2 h-8 rounded-l-md border border-gray-600 focus:outline-none focus:border-sky-500 w-32 text-sm appearance-none [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        min="1" // Ngăn người dùng nhập số âm hoặc 0 qua UI (nhưng vẫn cần validate)
      />
      <button
        onClick={handleGoClick}
        className="bg-sky-600 hover:bg-sky-700 text-white px-4 h-8 rounded-r-md text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50 transition-colors duration-150"
      >
        Đi
      </button>
    </div>
  );
};

export default GoToChapterInput;