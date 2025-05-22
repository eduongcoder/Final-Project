import React from 'react';
// Import các icon từ lucide-react
import { Coins, CreditCard, XCircle, Receipt, Smartphone, Lightbulb } from 'lucide-react';

const TopUpPage = () => {
  return (
    <div className="bg-gray-100 p-8">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <img
            src="https://via.placeholder.com/1200x400" // Thay ảnh của bạn ở đây
            alt="Banner"
            className="w-full h-auto rounded-lg shadow-md"
          />
        </div>

        {/* Lưu ý trước khi nạp tiền */}
        <div className="bg-yellow-100 p-4 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold text-gray-800">Vui lòng đọc kỹ nội dung bên dưới trước khi mua:</h2>
          <ul className="mt-2 list-inside space-y-2"> {/* Thêm space-y-2 để có khoảng cách giữa các mục */}
            <li className="text-gray-700 flex items-center">
              <Coins size={20} className="mr-2 text-yellow-700" /> {/* Icon tiền */}
              Là đơn vị tiền ảo chỉ lưu hành trong hệ thống.
            </li>
            <li className="text-gray-700 flex items-center">
              <CreditCard size={20} className="mr-2 text-yellow-700" /> {/* Icon thẻ */}
              Chỉ có thể dùng để nâng cấp tài khoản, mở khóa chương, tặng quà cho tác giả.
            </li>
            <li className="text-gray-700 flex items-center">
              <XCircle size={20} className="mr-2 text-red-600" /> {/* Icon không/cấm */}
              Đã mua sẽ không được hoàn lại hoặc bị trả về.
            </li>
            <li className="text-gray-700 flex items-center">
              <Receipt size={20} className="mr-2 text-yellow-700" /> {/* Icon chứng từ/giao dịch */}
              Chỉ được cộng cho bạn khi nào chứng từ xác nhận được thanh toán của bạn.
            </li>
            <li className="text-gray-700 flex items-center">
              <Smartphone size={20} className="mr-2 text-yellow-700" /> {/* Icon điện thoại */}
              Có thể mua thông qua một trong các hình thức thanh toán bên dưới.
            </li>
          </ul>
        </div>

        {/* Phương thức thanh toán */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-800">Phương thức thanh toán</h2>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"> {/* Responsive hơn */}
            {/* PayPal */}
            <div className="flex flex-col sm:flex-row justify-center items-center bg-blue-600 text-white p-4 rounded-lg shadow-md cursor-pointer hover:bg-blue-700 transition-colors">
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-8 w-auto mb-2 sm:mb-0 sm:mr-3" /> {/* Logo PayPal thật */}
              <span>Thanh toán qua PayPal</span>
            </div>

            {/* VISA/MasterCard */}
            <div className="flex flex-col sm:flex-row justify-center items-center bg-gray-700 text-white p-4 rounded-lg shadow-md cursor-pointer hover:bg-gray-800 transition-colors">
              {/* Bạn có thể dùng logo VISA và MasterCard ở đây */}
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="VISA" className="h-6 w-auto mb-1 sm:mb-0 sm:mr-2" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Mastercard_2019_logo.svg" alt="MasterCard" className="h-6 w-auto mb-2 sm:mb-0 sm:mr-3" />
              <span>VISA / MasterCard</span>
            </div>

            {/* Thẻ điện thoại */}
            <div className="flex flex-col sm:flex-row justify-center items-center bg-red-600 text-white p-4 rounded-lg shadow-md cursor-pointer hover:bg-red-700 transition-colors">
              <Smartphone size={28} className="mb-2 sm:mb-0 sm:mr-3" /> {/* Icon điện thoại cho thẻ cào */}
              <span>Thanh toán qua thẻ cào</span>
            </div>
          </div>
        </div>

        {/* Lưu ý không đổi ngược lại */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-8 border border-gray-200"> {/* Thêm border nhẹ */}
          <h2 className="text-lg font-semibold text-gray-800 flex items-center">
            <Lightbulb size={22} className="mr-2 text-blue-500" /> {/* Icon bóng đèn */}
            Lưu ý quan trọng:
          </h2>
          <p className="text-gray-700 mt-2">
            Nếu bạn không thể thanh toán bằng phương thức trên, vui lòng liên hệ với chúng tôi qua các kênh hỗ trợ. Mọi giao dịch đều được bảo mật và nhanh chóng.
          </p>
        </div>

        {/* Footer */}
        <div className="text-center mt-10 text-gray-500 text-sm">
          <p>Mê Truyện Chữ là nền tảng mới trực tuyến, nơi bạn có thể đọc và đồng góp nội dung từ các tác giả viết truyện và các dịch giả convert, dịch truyện.</p>
          <div className="mt-4 flex flex-wrap justify-center space-x-4 sm:space-x-6"> {/* Thêm flex-wrap cho mobile */}
            <a href="#" className="text-blue-600 hover:underline">Điều khoản dịch vụ</a>
            <a href="#" className="text-blue-600 hover:underline">Chính sách bảo mật</a>
            <a href="#" className="text-blue-600 hover:underline">Về bản quyền</a>
            <a href="#" className="text-blue-600 hover:underline">Hướng dẫn sử dụng</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopUpPage;