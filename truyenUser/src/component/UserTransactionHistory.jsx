// src/components/UserTransactionHistory/UserTransactionHistory.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaFilter, FaInfoCircle, FaCheckCircle, FaTimesCircle, FaHourglassHalf } from 'react-icons/fa';
import { mockTransactionHistory } from '../data/mockTransactionHistory'; // Import mock data

// Hàm helper để định dạng ngày tháng
const formatDate = (isoDateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(isoDateString).toLocaleDateString('vi-VN', options);
};

// Hàm helper để định dạng số tiền
const formatCurrency = (amount, currency) => {
  if (currency === 'VND') {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  }
  return `${amount.toLocaleString('de-DE')} ${currency}`; // de-DE để có dấu chấm phân cách hàng nghìn
};

const getStatusStyles = (status) => {
  switch (status.toLowerCase()) {
    case 'thành công':
      return {
        icon: <FaCheckCircle className="text-green-500 mr-1.5" />,
        textClass: 'text-green-600 dark:text-green-400',
        bgClass: 'bg-green-100 dark:bg-green-700/30',
      };
    case 'thất bại':
      return {
        icon: <FaTimesCircle className="text-red-500 mr-1.5" />,
        textClass: 'text-red-600 dark:text-red-400',
        bgClass: 'bg-red-100 dark:bg-red-700/30',
      };
    case 'đang xử lý':
      return {
        icon: <FaHourglassHalf className="text-yellow-500 mr-1.5 animate-spin" />,
        textClass: 'text-yellow-600 dark:text-yellow-400',
        bgClass: 'bg-yellow-100 dark:bg-yellow-700/30',
      };
    default:
      return {
        icon: <FaInfoCircle className="text-gray-500 mr-1.5" />,
        textClass: 'text-gray-600 dark:text-gray-400',
        bgClass: 'bg-gray-100 dark:bg-slate-700/30',
      };
  }
};


const UserTransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [filterType, setFilterType] = useState('all'); // 'all', 'nap', 'tieu', 'rut'

  useEffect(() => {
    // Trong thực tế, bạn sẽ fetch dữ liệu từ API dựa trên filterType
    let filteredData = mockTransactionHistory;
    if (filterType === 'nap') {
      filteredData = mockTransactionHistory.filter(t => t.type.toLowerCase().includes('nạp') && t.amount > 0);
    } else if (filterType === 'tieu') {
      filteredData = mockTransactionHistory.filter(t => t.amount < 0 && t.currency === 'Linh Thạch');
    } else if (filterType === 'rut') {
        filteredData = mockTransactionHistory.filter(t => t.type.toLowerCase().includes('rút'));
    }
    setTransactions(filteredData.sort((a, b) => new Date(b.date) - new Date(a.date))); // Sắp xếp mới nhất lên đầu
  }, [filterType]);

  return (
    <div className="container mx-auto my-8 p-4 sm:p-6 bg-white dark:bg-slate-900 shadow-xl rounded-lg">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 pb-4 border-b border-gray-200 dark:border-slate-700">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-3 sm:mb-0">
          Lịch sử giao dịch
        </h2>
        <div className="flex items-center space-x-2">
          <FaFilter className="text-gray-500 dark:text-gray-400" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2"
          >
            <option value="all">Tất cả</option>
            <option value="nap">Nạp tiền/Linh Thạch</option>
            <option value="tieu">Tiêu thụ Linh Thạch</option>
            <option value="rut">Rút tiền</option>
          </select>
        </div>
      </div>

      {transactions.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400 py-10">
          Không có giao dịch nào phù hợp.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
            <thead className="bg-gray-50 dark:bg-slate-800">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Thời gian
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Loại giao dịch
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden md:table-cell">
                  Mô tả
                </th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Số tiền
                </th>
                <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Trạng thái
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-900 divide-y divide-gray-200 dark:divide-slate-700">
              {transactions.map((txn) => {
                const statusStyle = getStatusStyles(txn.status);
                const amountColor = txn.amount > 0 ? 'text-green-600 dark:text-green-400' : (txn.amount < 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300');

                return (
                  <tr key={txn.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors duration-150">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center">
                        <FaCalendarAlt className="mr-2 text-gray-400 dark:text-gray-500" />
                        {formatDate(txn.date)}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">{txn.type}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 hidden md:table-cell max-w-xs truncate" title={txn.description}>
                      {txn.description}
                    </td>
                    <td className={`px-4 py-3 whitespace-nowrap text-sm font-semibold text-right ${amountColor}`}>
                      {txn.amount > 0 && txn.currency === 'VND' ? '+' : ''}
                      {formatCurrency(txn.amount, txn.currency)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                      <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyle.bgClass} ${statusStyle.textClass}`}>
                        {statusStyle.icon}
                        {txn.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
       {/* Phân trang (nếu cần) */}
       {transactions.length > 10 && ( // Ví dụ hiển thị phân trang nếu có hơn 10 item
        <div className="mt-6 flex justify-center">
          {/* Component phân trang của bạn sẽ ở đây */}
          <p className="text-sm text-gray-500 dark:text-gray-400">Phân trang...</p>
        </div>
      )}
    </div>
  );
};

export default UserTransactionHistory;