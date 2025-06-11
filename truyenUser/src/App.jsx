// App.jsx
import React, { useEffect } from 'react'; // Thêm useEffect
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from "react-redux"; // Thêm useDispatch, useSelector

import store from "./redux/store"; // Đường dẫn tới store của bạn

// Import các actions "getAll" từ các slice của bạn
import { getAllNovels } from './redux/novelSlice'; // Điều chỉnh đường dẫn nếu cần
// import { getAllAuthors } from './redux/authorSlice'; // Điều chỉnh đường dẫn
import { getAllCategories } from './redux/categorySlice'; // Điều chỉnh đường dẫn
import {loadUserFromStorage} from './redux/userSlice'; // Điều chỉnh đường dẫn
// Import các component trang
import ReadingPage from './component/page/readingPage'; // Component mới sẽ tạo
import Home from './component/page/home';
import Navbar from './component/Navbar'; // Navbar có thể nằm ngoài Router nếu muốn nó cố định
import DetailPage from './component/page/DetailPage';
import NotFoundPage from './component/NotFoundPage';
import DepositPage from './component/page/DepositPage';
import ReadingHistoryPage from './component/page/ReadingHistoryPage';
import TransactionHistoryPage from './component/page/TransactionHistoryPage';

// Component trung gian để xử lý việc fetch dữ liệu
const AppContent = () => {
  const dispatch = useDispatch();

  // Lấy trạng thái loading hoặc dữ liệu để tránh gọi lại nếu đã có
  const { novels, loading: novelsLoading } = useSelector((state) => state.novels);
  const { authors, loading: authorsLoading } = useSelector((state) => state.authors);
  const { categories, loading: categoriesLoading } = useSelector((state) => state.categories);

  useEffect(() => {
    // Chỉ dispatch nếu dữ liệu chưa có hoặc chưa từng được tải
    if (!novelsLoading && (!novels || novels.length === 0)) {
      console.log("App.jsx: Fetching all novels for the first time.");
      dispatch(getAllNovels());
    }
    dispatch(loadUserFromStorage());
    // if (!authorsLoading && (!authors || authors.length === 0)) {
    //   console.log("App.jsx: Fetching all authors for the first time.");
    //   dispatch(getAllAuthors());
    // }

    if (!categoriesLoading && (!categories || categories.length === 0)) {
      console.log("App.jsx: Fetching all categories for the first time.");
      dispatch(getAllCategories());
    }
}, [dispatch, novels, authors, categories, novelsLoading, authorsLoading, categoriesLoading]);

  // Hiển thị một loader toàn cục trong khi dữ liệu ban đầu đang được tải (tùy chọn)
  // if (
  //   (novelsLoading && (!novels || novels.length === 0)) ||
  //   (authorsLoading && (!authors || authors.length === 0)) ||
  //   (categoriesLoading && (!categories || categories.length === 0))
  // ) {
  //   return (
  //     <div className="flex justify-center items-center min-h-screen bg-gray-800 text-white">
  //       Đang tải dữ liệu ứng dụng...
  //     </div>
  //   );
  // }


  // Router và Routes nên nằm bên trong component con này
  // để đảm bảo Redux context (Provider) đã bao bọc chúng
  return (
    <Router>
      <div> {/* Bạn có thể giữ div này hoặc dùng Fragment <> */}
        <Navbar /> {/* Navbar giờ sẽ có quyền truy cập vào Redux store */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/novel/:novelId" element={<DetailPage />} />
          <Route path="/novel/:novelId/chapter/:chapterId" element={<ReadingPage />} />
          <Route path="/deposit" element={<DepositPage />} />
          <Route path="/user/reading-history" element={<ReadingHistoryPage />} />
          <Route path="/user/transaction-history" element={<TransactionHistoryPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        {/* Footer có thể đặt ở đây */}
      </div>
    </Router>
  );
}


function App() {
  return (
    <Provider store={store}>
      <AppContent /> {/* Sử dụng component trung gian */}
    </Provider>
  );
}

export default App;