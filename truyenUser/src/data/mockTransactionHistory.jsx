// src/data/mockTransactionHistory.js
export const mockTransactionHistory = [
  {
    id: 'txn_1',
    type: 'Nạp Linh Thạch',
    description: 'Nạp gói 1000 Linh Thạch qua Momo',
    amount: 50000, // Số tiền VND
    currency: 'VND',
    status: 'Thành công', // 'Thành công', 'Thất bại', 'Đang xử lý'
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 ngày trước
    detailsLink: '/transaction/txn_1', // Link xem chi tiết (nếu có)
    paymentMethod: 'Momo',
  },
  {
    id: 'txn_2',
    type: 'Mở khóa chương VIP',
    description: 'Mở khóa 10 chương VIP truyện "Nhất Niệm Vĩnh Hằng"',
    amount: -100, // Số Linh Thạch bị trừ
    currency: 'Linh Thạch',
    status: 'Thành công',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 ngày trước
    detailsLink: '/novel/nhat-niem-vinh-hang/vip-unlock',
  },
  {
    id: 'txn_3',
    type: 'Đề cử truyện',
    description: 'Đề cử 100 Linh Thạch cho "Đấu Phá Thương Khung"',
    amount: -100,
    currency: 'Linh Thạch',
    status: 'Thành công',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 ngày trước
  },
  {
    id: 'txn_4',
    type: 'Nạp Linh Thạch',
    description: 'Nạp gói 500 Linh Thạch qua ZaloPay - Giao dịch lỗi',
    amount: 25000,
    currency: 'VND',
    status: 'Thất bại',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 ngày trước
    paymentMethod: 'ZaloPay',
  },
  {
    id: 'txn_5',
    type: 'Nhận thưởng điểm danh',
    description: 'Thưởng 10 Linh Thạch từ điểm danh hàng ngày',
    amount: 10,
    currency: 'Linh Thạch',
    status: 'Thành công',
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 ngày trước
  },
  {
    id: 'txn_6',
    type: 'Rút tiền',
    description: 'Yêu cầu rút 200,000 VND về tài khoản ngân hàng',
    amount: -200000,
    currency: 'VND',
    status: 'Đang xử lý',
    date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(), // 12 ngày trước
    paymentMethod: 'Chuyển khoản ngân hàng',
  }
];