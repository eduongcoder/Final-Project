import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Redux actions
import { getAllAuthors } from "@/redux/authorSlice";
import { getAllNovels } from "@/redux/novelSlice";
import { getAllCategories } from "@/redux/categorySlice";
// `loadUserFromStorage` không còn cần thiết ở đây nữa

// Layout & Pages
import AdminLayouts from "@/pages/layouts/AdminLayouts";
import LoginAdmin from "@/pages/admin/LoginAdmin";
import PageNotFound from "@/pages/PageNotFound";
import {
  Dashboard, CategoryManagement, NovelManagement,
  CommentManagement, AnalyticsReport, CustomerManagement,
  PaymentManagement
} from "../pages";

const adminTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
    background: { default: '#f4f6f8', paper: '#ffffff' }
  },
});

// --- COMPONENT BẢO VỆ ROUTE (PHIÊN BẢN MỚI, GỌN HƠN) ---
const ProtectedAdminRoute = ({ children }) => {
  // Chỉ cần lấy 2 trạng thái này từ Redux
  const { currentUser, isVerifyingSession } = useSelector((state) => state.user) || {};

  // Nếu đang trong quá trình xác thực token với server, hiển thị màn hình chờ.
  // Đây là điểm mấu chốt để ngăn việc bị đá về trang login khi F5.
  if (isVerifyingSession) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '1.2rem' }}>
        Đang tải phiên đăng nhập...
      </div>
    );
  }

  // Sau khi đã xác thực xong, nếu không có currentUser, chuyển hướng về trang login.
  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  // Nếu mọi thứ ổn, render các component con đã được truyền vào.
  return children; 
};

// --- COMPONENT TẢI DỮ LIỆU (Giữ nguyên) ---
const PreloadDataWrapper = ({ children }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    // Chỉ tải dữ liệu này KHI người dùng đã được xác thực và vào trang admin
    dispatch(getAllAuthors());
    dispatch(getAllNovels());
    dispatch(getAllCategories());
  }, [dispatch]);
  return children;
};

// --- CẤU HÌNH ROUTER (Giữ nguyên cấu trúc) ---
const router = createBrowserRouter([
  { path: "/", element: <LoginAdmin /> },
  {
    path: "/admin",
    element: (
      <ProtectedAdminRoute>
        <ThemeProvider theme={adminTheme}>
          <CssBaseline />
          <PreloadDataWrapper>
            <AdminLayouts /> 
          </PreloadDataWrapper>
        </ThemeProvider>
      </ProtectedAdminRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: "categoris", element: <CategoryManagement /> },
      { path: "novels", element: <NovelManagement /> },
      { path: "payment", element: <PaymentManagement /> },
      { path: "analytics-report", element: <AnalyticsReport /> },
      { path: "customer", element: <CustomerManagement /> },
      { path: "comment", element: <CommentManagement /> },
    ],
  },
  { path: "*", element: <PageNotFound /> },
]);

export default function RouterSetup() {
  return <RouterProvider router={router} />;
}