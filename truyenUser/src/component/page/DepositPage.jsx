// src/pages/DepositPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DepositModal from '../DepositModal'; // Điều chỉnh đường dẫn nếu cần

const DepositPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(true); // Modal mở sẵn khi vào trang
  const navigate = useNavigate();

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Sau khi đóng modal, điều hướng người dùng đi đâu đó, ví dụ: quay lại trang trước hoặc trang chủ
    navigate(-1); // Quay lại trang trước
    // Hoặc navigate('/'); // Về trang chủ
  };

  // Nếu isModalOpen thay đổi thành false (ví dụ, người dùng bấm ESC nếu modal hỗ trợ)
  // thì cũng điều hướng đi
  useEffect(() => {
    if (!isModalOpen) {
      // Đảm bảo rằng chúng ta điều hướng đi nếu modal đã đóng
      // Điều này có thể hơi thừa nếu handleCloseModal luôn được gọi.
      // Cân nhắc nếu modal có thể tự đóng mà không qua handleCloseModal.
      const timeoutId = setTimeout(() => navigate(-1), 0); // Delay nhỏ để tránh lỗi warning state update
      return () => clearTimeout(timeoutId);
    }
  }, [isModalOpen, navigate]);

  return (
    <div>
      {/* Bạn có thể thêm nội dung nền cho trang này nếu muốn */}
      {/* Ví dụ: <div className="page-background">Nạp Tiền</div> */}
      <DepositModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default DepositPage;