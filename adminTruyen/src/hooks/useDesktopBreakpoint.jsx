import React, { useState, useEffect } from "react";

/**
 * Hook kiểm tra xem người dùng đang ở chế độ desktop (>= breakpoint)
 * @param {number} breakpoint - Ngưỡng pixel để xem là desktop (mặc định 1024)
 * @returns {boolean} - Trả về true nếu là desktop, false nếu không
 */
export const useDesktopBreakpoint = (breakpoint = 1024) => {
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        // Hàm cập nhật trạng thái theo kích thước cửa sổ
        const checkDesktop = () => {
            setIsDesktop(window.innerWidth >= breakpoint);
        };

        checkDesktop(); // Gọi ngay khi component được mount
        window.addEventListener("resize", checkDesktop); // Theo dõi thay đổi kích thước
        
        // Dọn sự kiện khi unmount
        return () => window.removeEventListener("resize", checkDesktop);
    }, [breakpoint]);

    return isDesktop;
};
