import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScrollToTop from "@/components/Header-Components/ScrollToTop";
import React from "react";
import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router-dom";

const HomeLayout = () => {
    return (
        <>
            <ScrollToTop /> {/* 0. Thiết lập Scroll to top */}
            <Header /> {/* 1. Thiết lập header */}
            <Outlet /> {/* 2. Thiết lập OUTLET */}
            <Footer /> {/* 3. Thiết lập footer */}
            <Toaster /> {/* 4. Thiết lập thông báo Hot Toast Mặc định */}
        </>
    );
};

export default HomeLayout;
