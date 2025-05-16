import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import backgroundImage from '../assets/anh2.jpg';

const stories = [
    { title: "Ai Dạy Cậu Làm Bạn Cùng Phòng Kiểu Này?", image: backgroundImage, time: "13 GIỜ" },
    { title: "Ta Mẹ Quản Ta Từ Cường Phi Thăng", image: backgroundImage },
    { title: "Gậy Ông Đập Lưng Ông", image: backgroundImage },
    { title: "Sau Khi Mở Cửa Hàng", image: backgroundImage },
    { title: "BOSS Tàn Nhẫn", image: backgroundImage },
    { title: "Thiếu Kính Thất", image: backgroundImage },
    { title: "Trọng Sinh Cá Mặn", image: backgroundImage },
    { title: "Phản Diện Không Chịu Thừa Nhận", image: backgroundImage },
    { title: "Nghịch Tập Tình Thâm", image: backgroundImage },
];

const StorySlider = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        📢 Thành Viên Bố Cáo
      </h2>

      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={10}
        slidesPerView={6}
        centeredSlides={true}
        navigation
        autoplay={{ delay: 2000, disableOnInteraction: false }}
        grabCursor={true}
        loop={true}
        className="relative"
      >
        {stories.map((story, index) => (
          <SwiperSlide key={index}>
            <div className="relative group">
              <img
                src={story.image}
                alt={story.title}
                className="rounded-lg w-full h-48 object-cover"
              />
              {story.time && (
                <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                  {story.time}
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs text-center py-1 truncate">
                {story.title}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default StorySlider;

