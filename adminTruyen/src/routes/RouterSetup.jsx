import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { getAllAuthors } from "@/redux/authorSlice";
import { getAllNovels } from "@/redux/novelSlice";

// Import layout & pages
import AdminLayouts from "@/pages/layouts/AdminLayouts";
import {
  Dashboard, CategoryManagement, NovelManagement,
  CommentManagement, AnalyticsReport, CustomerManagement,
  PaymentManagement
} from "../pages";
import PageNotFound from "@/pages/PageNotFound";

// Preload data wrapper
const PreloadDataWrapper = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllAuthors());
    dispatch(getAllNovels());
  }, [dispatch]);

  return children;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PreloadDataWrapper>
        <AdminLayouts />
      </PreloadDataWrapper>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: "category", element: <CategoryManagement /> },
      { path: "novels", element: <NovelManagement /> },
      { path: "payment", element: <PaymentManagement /> },
      { path: "analyticsReport", element: <AnalyticsReport /> },
      { path: "customer", element: <CustomerManagement /> },
      { path: "comment", element: <CommentManagement /> },
      { path: "*", element: <PageNotFound /> },
    ],
  },
]);

export default function RouterSetup() {
  return <RouterProvider router={router} />;
}
