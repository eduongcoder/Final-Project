import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from "react-router-dom";
import { ThemeProvider, createTheme } from '@mui/material/styles'; // BƯỚC 1: Import
import CssBaseline from '@mui/material/CssBaseline';                // (Khuyến khích)

// Redux actions
import { getAllAuthors } from "@/redux/authorSlice";
import { getAllNovels } from "@/redux/novelSlice";
import { getAllCategories } from "@/redux/categorySlice";
import { loadUserFromStorage } from "@/redux/userSlice";

// Layout & Pages
import AdminLayouts from "@/pages/layouts/AdminLayouts";
import LoginAdmin from "@/pages/admin/LoginAdmin";
import PageNotFound from "@/pages/PageNotFound";
import {
  Dashboard, CategoryManagement, NovelManagement,
  CommentManagement, AnalyticsReport, CustomerManagement,
  PaymentManagement
} from "../pages";

// BƯỚC 2: Tạo theme (có thể đặt ở ngoài hoặc trong component)
const adminTheme = createTheme({
  palette: {
    mode: 'light', // or 'dark'
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f4f6f8',
      paper: '#ffffff',
    }
  },
  // Bạn có thể thêm các tùy chỉnh khác ở đây
});


// --- COMPONENT BẢO VỆ ROUTE (Giữ nguyên, đã đúng) ---
const ProtectedAdminRoute = ({ children }) => { // Thêm props 'children'
  const dispatch = useDispatch();
  const { currentUser, loading, token } = useSelector((state) => state.user) || {};

  useEffect(() => {
    if (!currentUser && token) {
        dispatch(loadUserFromStorage());
    }
  }, [dispatch, currentUser, token]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        Đang kiểm tra xác thực...
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  // Thay vì dùng <Outlet />, chúng ta render 'children' được truyền vào.
  // Điều này giúp cấu trúc linh hoạt hơn.
  return children; 
};

// --- COMPONENT TẢI DỮ LIỆU (Giữ nguyên) ---
const PreloadDataWrapper = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllAuthors());
    dispatch(getAllNovels());
    dispatch(getAllCategories());
  }, [dispatch]);

  return children;
};

// --- CẤU HÌNH ROUTER (Đã được sửa đổi) ---
const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginAdmin />,
  },
  {
    path: "/admin",
    // BƯỚC 3: Sửa đổi cấu trúc element
    element: (
      // Bọc ngoài cùng là Route được bảo vệ
      <ProtectedAdminRoute>
        {/* Bọc tiếp theo là ThemeProvider để cung cấp theme */}
        <ThemeProvider theme={adminTheme}>
          {/* CssBaseline để chuẩn hóa style */}
          <CssBaseline />
          {/* Bọc tiếp theo là component tải dữ liệu */}
          <PreloadDataWrapper>
            {/* Trong cùng là Layout của trang Admin */}
            {/* AdminLayouts sẽ chứa <Outlet /> để render các trang con */}
            <AdminLayouts /> 
          </PreloadDataWrapper>
        </ThemeProvider>
      </ProtectedAdminRoute>
    ),
    // Các children này sẽ được render bởi <Outlet /> bên trong AdminLayouts
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
  {
    path: "*",
    element: <PageNotFound />,
  },
]);

export default function RouterSetup() {
  return <RouterProvider router={router} />;
}