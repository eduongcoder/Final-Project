// src/components/ChapterListDisplay.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Thêm useNavigate
import { useSelector } from 'react-redux'; // Để lấy thông tin currentUser

// Component Dialog xác nhận mua chương
const PurchaseChapterDialog = ({ chapterTitle, chapterPrice, onConfirm, onCancel }) => (
  <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[9999]"> {/* z-index cao hơn */}
    <div className="bg-white rounded-lg shadow-xl p-6 w-11/12 max-w-md text-gray-800">
      <h3 className="text-xl font-semibold mb-4">Xác nhận mua chương</h3>
      <p className="mb-2">Bạn có muốn mua chương:</p>
      <p className="font-semibold text-blue-600 mb-4 truncate" title={chapterTitle}>{chapterTitle}</p>
      <p className="mb-6">với giá <span className="font-bold text-orange-500">{chapterPrice} xu</span>?</p>
      <div className="flex justify-end space-x-3">
        <button
          onClick={onCancel}
          className="px-5 py-2 rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors"
        >
          Không
        </button>
        <button
          onClick={onConfirm}
          className="px-5 py-2 rounded-md text-white bg-green-500 hover:bg-green-600 transition-colors"
        >
          Có (Mua)
        </button>
      </div>
    </div>
  </div>
);


const ChapterListDisplay = ({
  chapters,
  novelId,
  currentPage = 1,
  chaptersPerPage = 50
}) => {
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user.currentUser); // Lấy thông tin người dùng hiện tại

  const [purchasedChapters, setPurchasedChapters] = useState({}); // State để theo dõi các chương đã mua (key: chapterId, value: true)
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false);
  const [chapterToPurchase, setChapterToPurchase] = useState(null); // { id, title, price }

  const CHAPTER_PRICE = 3; // Giá mỗi chương

  // Load trạng thái các chương đã mua từ localStorage khi component mount
  useEffect(() => {
    if (currentUser && novelId) {
      const key = `purchased_${currentUser.idUser}_${novelId}`;
      const storedPurchases = localStorage.getItem(key);
      if (storedPurchases) {
        setPurchasedChapters(JSON.parse(storedPurchases));
      }
    } else {
      // Nếu không có user hoặc novelId, reset purchasedChapters
      setPurchasedChapters({});
    }
  }, [currentUser, novelId]); // Chạy lại khi user hoặc novelId thay đổi

  const handlePurchaseClick = (chapter) => {
    if (!currentUser) {
      // Yêu cầu đăng nhập nếu chưa đăng nhập
      alert("Vui lòng đăng nhập để mua chương.");
      navigate('/login'); // Hoặc tới trang đăng nhập của bạn
      return;
    }
    setChapterToPurchase({
      id: chapter.idChapter,
      title: chapter.titleChapter || "Chưa có tiêu đề",
      price: CHAPTER_PRICE,
      novelId: novelId, // Thêm novelId để điều hướng
    });
    setShowPurchaseDialog(true);
  };

  const confirmPurchase = () => {
    if (chapterToPurchase) {
      // TODO: (TƯƠNG LAI) Gọi API trừ xu ở đây
      // Ví dụ: dispatch(deductCoinsAction(currentUser.idUser, chapterToPurchase.price))
      //       .then(() => {
      //         // Sau khi trừ xu thành công:
      //         markChapterAsPurchased(chapterToPurchase.id);
      //         navigate(`/novel/${chapterToPurchase.novelId}/chapter/${chapterToPurchase.id}`);
      //       })
      //       .catch(error => {
      //         console.error("Lỗi trừ xu:", error);
      //         alert("Không thể mua chương. Vui lòng thử lại.");
      //       });

      // HIỆN TẠI: Dùng cơ chế cũ (đánh dấu đã mua và điều hướng)
      console.log(`Đã "mua" chương: ${chapterToPurchase.title} với giá ${chapterToPurchase.price} xu.`);
      markChapterAsPurchased(chapterToPurchase.id);
      navigate(`/novel/${chapterToPurchase.novelId}/chapter/${chapterToPurchase.id}`);
    }
    setShowPurchaseDialog(false);
    setChapterToPurchase(null);
  };

  const cancelPurchase = () => {
    setShowPurchaseDialog(false);
    setChapterToPurchase(null);
  };

  const markChapterAsPurchased = (chapterIdToMark) => {
    if (currentUser && novelId) {
      const key = `purchased_${currentUser.idUser}_${novelId}`;
      const updatedPurchases = { ...purchasedChapters, [chapterIdToMark]: true };
      setPurchasedChapters(updatedPurchases);
      localStorage.setItem(key, JSON.stringify(updatedPurchases));
    }
  };


  if (!chapters || !Array.isArray(chapters) || chapters.length === 0) {
    return <p className="text-gray-400 text-center py-4">Chưa có chương nào.</p>;
  }
  if (!novelId) {
    return <p className="text-red-500 text-center py-4">Lỗi: Không thể tạo link chương.</p>;
  }

  const chapterNumberOffset = (currentPage - 1) * chaptersPerPage;

  return (
    <>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 text-sm">
        {chapters.map((chapter, index) => {
          const chapterNumberDisplay = chapter.chapterNumber !== undefined && chapter.chapterNumber !== null
            ? `Chương ${chapter.chapterNumber}`
            : `Chương ${chapterNumberOffset + index + 1}`;
          
          const chapterTitle = chapter.titleChapter || "Chưa có tiêu đề";
          const isPurchased = !!purchasedChapters[chapter.idChapter]; // Kiểm tra xem chương đã được mua chưa

          if (!chapter.idChapter) {
            return (
              <li key={`invalid-chapter-${index}`} className="flex items-stretch border-b border-gray-700 opacity-50">
                <span className="w-20 md:w-24 flex-shrink-0 text-left py-2.5 border-r border-gray-700 mr-3 pl-2 text-gray-500">{chapterNumberDisplay}</span>
                <span className="py-2.5 pr-2 flex-1 text-gray-500 truncate" title="Thiếu ID chương">{chapterTitle} (Lỗi ID)</span>
              </li>
            );
          }

          // Giả sử mọi chương đều là chương VIP cần mua, trừ khi isPurchased là true
          // Bạn có thể thêm một trường `isVip` hoặc `price` từ API cho từng chương để xác định chính xác hơn
          const isVipChapter = true; // Giả định tất cả đều là VIP để demo

          return (
            <li key={chapter.idChapter} className="flex items-center justify-between border-b border-gray-700">
              <div className="flex items-center flex-grow min-w-0"> {/* Cho phép thu nhỏ khi cần */}
                <span className="w-20 md:w-24 flex-shrink-0 text-left py-2.5 border-r border-gray-700 mr-3 pl-2 text-gray-400">
                  {chapterNumberDisplay}
                </span>
                {isVipChapter && !isPurchased ? (
                  <span className="py-2.5 flex-1 text-gray-300 truncate" title={chapterTitle}>
                    {chapterTitle}
                  </span>
                ) : (
                  <Link
                    to={`/novel/${novelId}/chapter/${chapter.idChapter}`}
                    className="py-2.5 flex-1 text-gray-200 hover:text-sky-400 truncate"
                    title={chapterTitle}
                  >
                    {chapterTitle}
                  </Link>
                )}
              </div>

              {isVipChapter && !isPurchased && (
                <button
                  onClick={() => handlePurchaseClick(chapter)}
                  className="ml-3 px-3 py-1.5 text-xs bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors flex-shrink-0 my-1" // my-1 để không bị dính sát border
                  title={`Mua chương ${chapterTitle}`}
                >
                  {CHAPTER_PRICE} xu
                </button>
              )}
            </li>
          );
        })}
      </ul>

      {showPurchaseDialog && chapterToPurchase && (
        <PurchaseChapterDialog
          chapterTitle={chapterToPurchase.title}
          chapterPrice={chapterToPurchase.price}
          onConfirm={confirmPurchase}
          onCancel={cancelPurchase}
        />
      )}
    </>
  );
};

export default ChapterListDisplay;