// PaginationControls.jsx
import React from 'react';
import { FaAngleDoubleRight, FaAngleRight } from 'react-icons/fa';

// Icon sort giống trong hình (hoặc bạn có thể dùng icon từ react-icons nếu thích)
const SortIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
  </svg>
);

const PaginationControls = ({
  currentPage,
  totalPages,
  onPageChange,
  onSort, // Callback khi nhấn nút sort
  showSortButton = true, // Mặc định hiển thị nút sort
  maxPageButtons = 3, // Số lượng nút trang cụ thể hiển thị (ví dụ: 1, 2, 3)
}) => {
  const pageNumbers = [];

  // Logic để tạo danh sách các nút số trang cần hiển thị
  // Ví dụ đơn giản: hiển thị 'maxPageButtons' nút xung quanh trang hiện tại
  // hoặc luôn hiển thị 1, 2, 3 như trong ảnh
  if (totalPages <= maxPageButtons) {
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    // Logic phức tạp hơn có thể thêm dấu "..."
    // Dựa theo ảnh, chúng ta sẽ cố định hiển thị 1, 2, 3
    for (let i = 1; i <= Math.min(maxPageButtons, totalPages); i++) {
        pageNumbers.push(i);
    }
    // Nếu currentPage > 3 và totalPages lớn hơn, bạn có thể muốn điều chỉnh logic này
    // Ví dụ, nếu currentPage là 5, có thể hiển thị 4, 5, 6
    // Tuy nhiên, theo ảnh, nó luôn là 1, 2, 3 nên giữ nguyên
  }


  return (
    <div className="flex items-center space-x-1 text-sm">
      {pageNumbers.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          disabled={page > totalPages} // Vô hiệu hóa nếu số trang vượt quá tổng số trang
          className={`px-2 h-8 w-8 flex items-center justify-center rounded transition-colors duration-150
            ${ currentPage === page
                ? 'bg-sky-600 text-white'
                : 'bg-[#363942] hover:bg-gray-600 text-gray-300'
            }
            disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="px-2 h-8 w-8 flex items-center justify-center bg-[#363942] hover:bg-gray-600 text-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
        aria-label="Trang kế tiếp"
      >
        <FaAngleRight />
      </button>

      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage >= totalPages} // Vô hiệu hóa nếu đã ở trang cuối
        className="px-2 h-8 w-8 flex items-center justify-center bg-[#363942] hover:bg-gray-600 text-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
        aria-label="Trang cuối"
      >
        <FaAngleDoubleRight />
      </button>

      {showSortButton && onSort && ( // Chỉ hiển thị nếu showSortButton là true VÀ có hàm onSort
        <button
          onClick={onSort}
          className="p-2 h-8 w-8 flex items-center justify-center bg-[#363942] hover:bg-gray-600 text-gray-300 rounded ml-2 transition-colors duration-150"
          title="Sắp xếp"
          aria-label="Sắp xếp danh sách"
        >
          <SortIcon />
        </button>
      )}
    </div>
  );
};

export default PaginationControls;