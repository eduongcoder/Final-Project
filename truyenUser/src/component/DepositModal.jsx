// src/components/DepositModal/DepositModal.jsx
import React from 'react';
// Thay thế các icon từ react-icons bằng lucide-react
import { X, CreditCard, Gamepad2, ChevronRight, PartyPopper } from 'lucide-react';

// Icon PayPal, Visa, Mastercard thường là logo thương hiệu,
// Lucide không cung cấp sẵn. Chúng ta có thể giữ lại ảnh/SVG cho chúng
// hoặc sử dụng một icon chung chung như CreditCard.
// Ở đây tôi sẽ dùng CreditCard cho cả Visa và Mastercard, và một icon placeholder cho PayPal
// hoặc bạn có thể tìm SVG của logo PayPal để nhúng.

const BulletPoint = ({ children }) => (
  <li className="flex items-start">
    {/* Sử dụng ChevronRight từ Lucide cho bullet point */}
    <ChevronRight className="text-orange-500 mr-2 mt-1 flex-shrink-0" size={16} />
    {children}
  </li>
);

const DepositModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Đóng"
        >
          {/* Sử dụng X từ Lucide */}
          <X size={24} />
        </button>

        <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">Chọn Phương Thức Nạp Tiền</h2>

        <div className="bg-amber-50 p-4 rounded-md mb-6 text-sm text-gray-700">
          <p className="font-semibold mb-2">Vui lòng đọc kỹ nội dung bên dưới trước khi mua:</p>
          <ul className="space-y-1 list-none">
            <BulletPoint>Là đơn vị tiền ảo chỉ lưu hành trong hệ thống</BulletPoint>
            <BulletPoint>Chỉ có thể dùng để nâng cấp tài khoản, mở khóa chương, tặng quà cho tác giả</BulletPoint>
            <BulletPoint>Đã mua sẽ không được hoàn lại vì bất cứ lý do nào</BulletPoint>
            <BulletPoint>Chỉ được cộng cho bạn khi nào chúng tôi chắc chắn rằng đã nhận được thanh toán của bạn</BulletPoint>
            <BulletPoint>Có thể mua thông qua một trong các hình thức thanh toán bên dưới</BulletPoint>
          </ul>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Phương thức 1: Paypal, Visa, Master Card */}
          <button
            className="bg-amber-50 hover:bg-amber-100 border border-gray-300 p-6 rounded-lg text-center transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400"
            onClick={() => console.log('Selected PayPal/Card')}
          >
            <div className="flex items-center justify-center space-x-3 mb-3">
              {/* Giữ lại SVG hoặc ảnh logo PayPal nếu có, hoặc dùng icon chung */}
              {/* Ví dụ dùng icon CreditCard cho PayPal nếu không có logo */}
              <CreditCard className="text-3xl text-blue-600" size={36} />
              <CreditCard className="text-3xl text-blue-800" size={36} /> {/* Thay cho Visa */}
              <CreditCard className="text-3xl text-red-600" size={36} />   {/* Thay cho Mastercard */}
            </div>
            <p className="font-semibold text-gray-800">Thanh toán qua Paypal, Visa, Master Card</p>
            <p className="text-xs text-gray-600 mt-1">An toàn, nhanh chóng, tiện lợi</p>
          </button>

          {/* Phương thức 2: Thẻ cào, Thẻ game */}
          <button
            className="bg-amber-50 hover:bg-amber-100 border border-gray-300 p-6 rounded-lg text-center transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400"
            onClick={() => console.log('Selected Mobile/Game Card')}
          >
            <div className="flex items-center justify-center space-x-2 mb-3 h-[36px]"> {/* Thêm h-[36px] để căn chỉnh chiều cao */}
              {/* Logo nhà mạng giữ nguyên dạng ảnh */}
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Vinaphone_logo.svg/1200px-Vinaphone_logo.svg.png" alt="Vinaphone" className="h-6"/>
              <img src="https://upload.wikimedia.org/wikipedia/vi/thumb/a/a6/Logo_Mobifone.svg/1200px-Logo_Mobifone.svg.png" alt="Mobifone" className="h-6"/>
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Viettel_logo_2021.svg/800px-Viettel_logo_2021.svg.png" alt="Viettel" className="h-6"/>
              {/* Sử dụng Gamepad2 từ Lucide */}
              <Gamepad2 className="text-green-600" size={36} />
            </div>
            <p className="font-semibold text-gray-800">Thanh toán qua thẻ cào điện thoại, thẻ game</p>
            <p className="text-xs text-gray-600 mt-1">Nhiều mệnh giá, dễ dàng thực hiện</p>
          </button>
        </div>

        <div className="bg-yellow-500 text-white p-3 rounded-md text-center text-sm font-medium flex items-center justify-center">
          {/* Sử dụng PartyPopper từ Lucide */}
          <PartyPopper className="mr-2" size={20} />
          Lưu ý không đổi ngược lại thành Kẹo được
        </div>

      </div>
    </div>
  );
};

export default DepositModal;