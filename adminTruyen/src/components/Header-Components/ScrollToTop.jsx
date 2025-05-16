import React, { useState, useEffect } from 'react'
import { ChevronUp } from 'lucide-react' // ✅ Icon mũi tên đi lên (có thể thay bằng icon khác nếu muốn)

/**
 * ScrollToTop: Nút cuộn lên đầu trang
 * - Tự động hiện khi scroll xuống dưới 200px
 * - Ẩn khi ở trên đầu trang
 * - Cuộn mượt lên đầu khi bấm
 */

const ScrollToTop = () => {
    const [visible, setVisible] = useState(false);  // Trạng thái hiển thị của nút

    // Hàm chạy mỗi khi cuộn trang
    useEffect(() => {
        const toggleVisible = () => {
            const scrolled = window.scrollY;
            setVisible(scrolled > 200); // Nếu scroll quá 200px thì hiện nút, ngược lại ẩn
        };

        // Gắn event scroll mỗi khi cuộn
        window.addEventListener("scroll", toggleVisible);

        // Cleanup khi component unmount
        return () => window.removeEventListener("scroll", toggleVisible);
    }, []);

    // Hàm xử lý khi bấm vào nút
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth", // cuộn mượt
        });
    };

    // Nếu chưa scroll quá 200px thì không render gì cả
    // if (!visible) return null;

    // Render nút cuộn
    return (
        <div className={`fixed bottom-5 right-5 z-50
            transition-all duration-300 ease-in-out
            ${visible ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`
        }>
            <button
                onClick={scrollToTop}
                className={`bg-white p-5 rounded-full shadow-lg z-50 
                transition-all duration-300 ease-in-out border border-gray-200 
                hover:bg-black hover:text-white group relative`
                }
                aria-label='Scroll to top'
            >
                <ChevronUp size={24} className='absolute transition-transform duration-200 ease-in-out
                     transform -translate-x-1/2 -translate-y-1/2'/>
                <ChevronUp size={24} className='absolute transition-transform duration-200 ease-in-out
                    group-hover:-translate-y-4.5 transform -translate-x-1/2 -translate-y-1/2'/>
            </button>
        </div>
    )
}

export default ScrollToTop