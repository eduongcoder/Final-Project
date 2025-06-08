// src/components/ChapterListDisplay.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const ChapterListDisplay = ({ chapters, novelId }) => {
  if (!chapters || !Array.isArray(chapters) || chapters.length === 0) {
    return <p className="text-gray-400 text-center py-4">Chưa có chương nào trong trang này.</p>;
  }

  if (!novelId) {
    console.error("ChapterListDisplay: Missing novelId prop. Cannot create chapter links.");
    return <p className="text-red-500 text-center py-4">Lỗi: Không thể tạo link chương.</p>;
  }

  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 text-sm">
      {chapters.map((chapter, index) => {
        const chapterNumberDisplay = `Chương ${chapter.chapterNumber !== undefined ? chapter.chapterNumber : (chapter.idChapter || index + 1)}`;
        const chapterTitle = chapter.titleChapter || "Chương không có tiêu đề";

        if (!chapter.idChapter) {
            console.warn("Chapter object is missing 'idChapter' field:", chapter);
            return (
              <li key={`invalid-chapter-${index}`} className="flex items-stretch border-b border-gray-700 opacity-50">
                <span className="w-20 md:w-24 flex-shrink-0 text-left py-2.5 border-r border-gray-700 mr-3 pl-2 text-gray-500">{chapterNumberDisplay}</span>
                <span className="py-2.5 pr-2 flex-1 text-gray-500 truncate" title="Thiếu ID chương">{chapterTitle} (Lỗi)</span>
              </li>
            );
        }

        return (
          <li key={chapter.idChapter} className="flex items-stretch border-b border-gray-700">
            <span className="w-20 md:w-24 flex-shrink-0 text-left py-2.5 border-r border-gray-700 mr-3 pl-2 text-gray-400">
              {chapterNumberDisplay}
            </span>
            <Link
              to={`/novel/${novelId}/chapter/${chapter.idChapter}`}
              className="py-2.5 pr-2 flex-1 text-gray-200 hover:text-sky-400 truncate"
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