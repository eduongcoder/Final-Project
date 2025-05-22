// src/components/StorySlider.jsx (Giả sử vị trí file)
import React, { useMemo } from "react"; // Bỏ useEffect, useDispatch
import { useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { Link } from "react-router-dom";
import { Megaphone } from "lucide-react";

const StorySlider = () => {
  // Chỉ lấy novels từ store, không dispatch lại
  const { novels, loading, error } = useSelector((state) => state.novels);

  // Không còn:
  // const dispatch = useDispatch();
  // useEffect(() => {
  //   dispatch(getAllNovels());
  // }, [dispatch]);

  const renderError = (err) => (typeof err === 'string' ? err : err?.message || 'Đã có lỗi xảy ra.');

  const sliderStories = useMemo(() => {
    if (!novels || novels.length === 0) return [];
    // Giả sử có trường createdAtNovel hoặc updatedAtNovel để sắp xếp cho "Truyện Mới Cập Nhật"
    const sortedNovels = [...novels].sort((a, b) => {
        const dateA = new Date(a.updatedAtNovel || a.createdAtNovel || 0); // Lấy ngày update hoặc ngày tạo
        const dateB = new Date(b.updatedAtNovel || b.createdAtNovel || 0);
        return dateB - dateA; // Sắp xếp mới nhất lên đầu
    });
    return sortedNovels.slice(0, 10); // Lấy 10 truyện
  }, [novels]);

  // Hiển thị loading/error chỉ khi novels thực sự chưa có và đang fetch từ Home
  if (loading && novels.length === 0) return (
      <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
              <Megaphone size={24} className="mr-2 text-blue-600" />
              Truyện Mới Cập Nhật
          </h2>
          <p className="text-center text-gray-500">Đang tải...</p>
      </div>
  );

  if (error && novels.length === 0) {
      console.error("Lỗi tải truyện cho slider:", error);
      return (
          <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
                  <Megaphone size={24} className="mr-2 text-blue-600" />
                  Truyện Mới Cập Nhật
              </h2>
              <p className="text-center text-sm text-red-500">Không thể tải dữ liệu. Lỗi: {renderError(error)}</p>
          </div>
      );
  }

  if (!sliderStories || sliderStories.length === 0) return (
    <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
            <Megaphone size={24} className="mr-2 text-blue-600" />
            Truyện Mới Cập Nhật
        </h2>
        <p className="text-sm text-gray-500 text-center">Không có truyện mới nào để hiển thị.</p>
    </div>
  );


  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
        <Megaphone size={24} className="mr-2 text-blue-600" />
        Truyện Mới Cập Nhật
      </h2>
      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={10}
        slidesPerView={6}
        breakpoints={{
          320: { slidesPerView: 2, spaceBetween: 10 },
          640: { slidesPerView: 3, spaceBetween: 10 },
          768: { slidesPerView: 4, spaceBetween: 10 },
          1024: { slidesPerView: 6, spaceBetween: 10 }
        }}
        navigation
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        grabCursor={true}
        loop={sliderStories.length > 5} // Chỉ loop khi có đủ items cho một vòng lặp có ý nghĩa
        className="relative"
      >
        {sliderStories.map((story) => (
          <SwiperSlide key={story.idNovel}>
            <Link to={`/novel/${story.idNovel}`} className="relative group block">
              <img
                src={story.imageNovel || "https://via.placeholder.com/150x200.png?text=N"}
                alt={story.nameNovel}
                className="rounded-lg w-full h-48 object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs text-center py-1 truncate">
                {story.nameNovel}
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default StorySlider;