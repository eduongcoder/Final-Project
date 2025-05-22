// src/components/ChapterListDisplay.jsx (Giả sử vị trí file)
import React from 'react';
import { Link } from 'react-router-dom';

const ChapterListDisplay = ({ chapters }) => {
  // console.log("ChapterListDisplay - Chapters Prop:", chapters); // Bỏ comment nếu cần debug

  if (!chapters || !Array.isArray(chapters) || chapters.length === 0) {
    return <p className="text-gray-400 text-center py-4">Chưa có chương nào.</p>;
  }

  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 text-sm">
      {chapters.map((chapter, index) => {
        const chapterNumberDisplay = `Chương ${chapter.idChapter || (index + 1)}`;
        const chapterTitle = chapter.titleChapter || "Chương không có tiêu đề";

        // Logic highlight ví dụ, bạn có thể thay đổi hoặc xóa nếu không cần
        const isHighlighted = chapter.idChapter === 3;

        // API trả về trường 'novel' chứa idNovel của chương đó
        const novelIdForLink = chapter.novel;

        // Nếu chương này không có novelId (trường 'novel') hợp lệ,
        // hoặc idChapter không hợp lệ, thì bỏ qua không render chương này.
        if (!novelIdForLink || !chapter.idChapter) {
            console.warn("Chapter object is missing 'novel' (idNovel) or 'idChapter' field, or they are invalid:", chapter);
            return null; // Bỏ qua chương này để tránh tạo link hỏng
        }

        return (
          <li
            key={chapter.idChapter} // Nên dùng idChapter làm key nếu nó luôn duy nhất và tồn tại
            className={`flex items-stretch border-b border-gray-700 ${isHighlighted ? 'bg-slate-700 rounded' : ''}`}
          >
            <span
              className={`w-20 md:w-24 flex-shrink-0 text-left py-2.5 border-r border-gray-700 mr-3 pl-2 ${isHighlighted ? 'text-sky-300 font-medium' : 'text-gray-400'}`}
            >
              {chapterNumberDisplay}
            </span>
            <Link
              to={`/novel/${novelIdForLink}/chapter/${chapter.idChapter}`}
              className={`py-2.5 pr-2 flex-1 text-gray-200 hover:text-sky-400 truncate ${isHighlighted ? 'font-semibold text-sky-300' : ''}`}
              title={chapterTitle}
            >
              {chapterTitle}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default ChapterListDisplay;