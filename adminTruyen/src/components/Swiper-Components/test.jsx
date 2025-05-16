import React, { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Test = ({totalTimes = 5}) => {
  const lineRef = useRef(null);
  const progressContent = useRef(null);
  const requestRef = useRef();
  const startTimeRef = useRef();
  const totalDuration = totalTimes * 1000; // Thời gian tổng cộng cho mỗi slide (10 giây)

  const animateProgress = () => {
    const now = Date.now();
    const elapsed = now - startTimeRef.current;
    const progress = Math.min(elapsed / totalDuration, 1);

    if (lineRef.current) {
      lineRef.current.style.width = `${progress * 100}%`;
    }

    if (progressContent.current) {
      const secondsLeft = Math.ceil((totalDuration - elapsed) / 1000);
      progressContent.current.textContent = `${secondsLeft}s`;
    }

    if (progress < 1) {
      requestRef.current = requestAnimationFrame(animateProgress);
    }
  };

  const resetProgress = () => {
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    startTimeRef.current = Date.now();
    // reset width back to 0
    if (lineRef.current) lineRef.current.style.width = "0%";
    requestRef.current = requestAnimationFrame(animateProgress);
  };

  useEffect(() => {
    resetProgress();
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  return (
    <div className="relative w-full h-screen bg-gray-200">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{ delay: totalDuration, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation
        onSlideChange={resetProgress}
        className="h-full"
      >
        {[...Array(9)].map((_, i) => (
          <SwiperSlide key={i} className="flex items-center justify-center text-xl font-bold bg-white">
            Slide {i + 1}
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Linear progress bar + optional countdown */}
      <div className="absolute right-4 bottom-4 z-10 flex items-center">
        <div className="w-24 h-2 bg-gray-300 rounded-full overflow-hidden">
          <div ref={lineRef} className="h-full bg-blue-500 rounded-full" />
        </div>
        <span ref={progressContent} className="ml-2 text-sm font-bold text-blue-500"></span>
      </div>
    </div>
  );
};

export default Test;
