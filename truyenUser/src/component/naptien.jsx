import React from 'react';

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
          <ul className="mt-2 list-inside">
            <li className="text-gray-700">💰 Là đơn vị tiền ảo chỉ lưu hành trong hệ thống.</li>
            <li className="text-gray-700">💳 Chỉ có thể dùng để nâng cấp tài khoản, mở khóa chương, tặng quà cho tác giả.</li>
            <li className="text-gray-700">❌ Đã mua sẽ không được hoàn lại hoặc bị trả về.</li>
            <li className="text-gray-700">💸 Chỉ được cộng cho bạn khi nào chứng từ xác nhận được thanh toán của bạn.</li>
            <li className="text-gray-700">📱 Có thể mua thông qua một trong các hình thức thanh toán bên dưới.</li>
          </ul>
        </div>

        {/* Phương thức thanh toán */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-800">Phương thức thanh toán</h2>
          
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {/* PayPal */}
            <div className="flex justify-center items-center bg-blue-600 text-white p-4 rounded-lg shadow-md cursor-pointer hover:bg-blue-700">
              <img src="https://via.placeholder.com/60" alt="PayPal" className="mr-2" />
              <span>Thanh toán qua PayPal</span>
            </div>

            {/* VISA */}
            <div className="flex justify-center items-center bg-gray-700 text-white p-4 rounded-lg shadow-md cursor-pointer hover:bg-gray-800">
              <img src="https://via.placeholder.com/60" alt="VISA" className="mr-2" />
              <span>VISA / MasterCard</span>
            </div>

            {/* Thẻ điện thoại */}
            <div className="flex justify-center items-center bg-red-600 text-white p-4 rounded-lg shadow-md cursor-pointer hover:bg-red-700">
              <img src="https://via.placeholder.com/60" alt="Thẻ điện thoại" className="mr-2" />
              <span>Thanh toán qua thẻ điện thoại</span>
            </div>
          </div>
        </div>

        {/* Lưu ý không đổi ngược lại */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-lg font-semibold text-gray-800">Lưu ý:</h2>
          <p className="text-gray-700 mt-2">💡 Nếu bạn không thể thanh toán bằng phương thức trên, vui lòng liên hệ với chúng tôi qua các kênh hỗ trợ. Mọi giao dịch đều được bảo mật và nhanh chóng.</p>
        </div>

        {/* Footer */}
        <div className="text-center mt-10 text-gray-500 text-sm">
          <p>Mê Truyện Chữ là nền tảng mới trực tuyến, nơi bạn có thể đọc và đồng góp nội dung từ các tác giả viết truyện và các dịch giả convert, dịch truyện.</p>
          <div className="mt-4 flex justify-center space-x-6">
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
