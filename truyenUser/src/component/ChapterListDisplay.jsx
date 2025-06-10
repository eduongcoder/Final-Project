// src/components/ChapterListDisplay.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const ChapterListDisplay = ({
  chapters,
  novelId,
  // Tùy chọn: Thêm các props này nếu bạn muốn hiển thị số chương tuyệt đối khi có phân trang
  currentPage = 1, // Trang hiện tại, mặc định là 1
  chaptersPerPage = 50 // Số chương mỗi trang, dùng để tính offset
}) => {
  if (!chapters || !Array.isArray(chapters) || chapters.length === 0) {
    return <p className="text-gray-400 text-center py-4">Chưa có chương nào.</p>;
  }

  if (!novelId) {
    console.error("ChapterListDisplay: Missing novelId prop. Cannot create chapter links.");
    return <p className="text-red-500 text-center py-4">Lỗi: Không thể tạo link chương.</p>;
  }

  // Tính toán offset cho số chương nếu có phân trang
  // Ví dụ: trang 1, chaptersPerPage 50 => offset = 0
  //         trang 2, chaptersPerPage 50 => offset = 50
  const chapterNumberOffset = (currentPage - 1) * chaptersPerPage;

  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 text-sm">
      {chapters.map((chapter, index) => {
        let chapterNumberDisplay;

        if (chapter.chapterNumber !== undefined && chapter.chapterNumber !== null) {
          // Ưu tiên 1: Sử dụng chapterNumber từ API nếu có
          chapterNumberDisplay = `Chương ${chapter.chapterNumber}`;
        } else {
          // Ưu tiên 2: Tính toán dựa trên index và offset (nếu có phân trang)
          // Hoặc chỉ dùng index + 1 nếu không có thông tin phân trang đầy đủ
          // Để đơn giản, nếu không có chapterNumber, ta sẽ dùng index của mảng chapters hiện tại
          // Nếu muốn số thứ tự tuyệt đối qua các trang, bạn cần tính toán phức tạp hơn dựa vào currentPage và chaptersPerPage
          // Ở đây, ta giả định `chapters` là một danh sách đã được sắp xếp theo thứ tự chương
          // và ta muốn hiển thị số thứ tự dựa trên vị trí trong mảng `chapters` này cộng với offset (nếu bạn cung cấp currentPage và chaptersPerPage)
          // Nếu bạn chỉ muốn đếm từ 1 cho mỗi mảng `chapters` được truyền vào (không quan tâm phân trang), thì chỉ cần index + 1
          const calculatedChapterNumber = chapterNumberOffset + index + 1;
          chapterNumberDisplay = `Chương ${calculatedChapterNumber}`;
        }
        
        const chapterTitle = chapter.titleChapter || "Chưa có tiêu đề";

        if (!chapter.idChapter) {
            console.warn("ChapterListDisplay: Chapter object is missing 'idChapter' field:", chapter);
            return (
              <li key={`invalid-chapter-${index}`} className="flex items-stretch border-b border-gray-700 opacity-50">
                <span className="w-20 md:w-24 flex-shrink-0 text-left py-2.5 border-r border-gray-700 mr-3 pl-2 text-gray-500">{chapterNumberDisplay || `Chương ${index + 1}`}</span>
                <span className="py-2.5 pr-2 flex-1 text-gray-500 truncate" title="Thiếu ID chương">{chapterTitle} (Lỗi ID)</span>
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