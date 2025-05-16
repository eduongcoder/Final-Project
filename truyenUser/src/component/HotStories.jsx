import React from "react";
import backgroundImage from '../assets/anh2.jpg';
 
const hotStories = [
    { title: "Chí Tôn Tu La", image: backgroundImage, status: "FULL" },
    { title: "Đan Đạo Võ Sư", image: backgroundImage },
    { title: "Bất thiên võ hồn", image: backgroundImage },
    { title: "Thôn Thiên Long Vương", image: backgroundImage },
    { title: "Kiếm Chủ Bất Hoang", image: backgroundImage },
    { title: "Vạn Long Thần Tôn", image: backgroundImage },
    { title: "Vạn Cổ Thần Đế", image: backgroundImage, status: "FULL" },
    { title: "Tu Tiên Cuồng Đồ", image: backgroundImage, status: "FULL" },
    { title: "Long Huyết Võ Đế", image: backgroundImage },
    { title: "Xích Long Võ Thần", image: backgroundImage, status: "FULL" },
    { title: "Long Ngao Chiến Thần", image: backgroundImage },
    { title: "Toàn Dân Chuyển Chức", image: backgroundImage },
    { title: "Xuyên thành áo choàng đại lão muội muội", image: backgroundImage, status: "FULL" },
    { title: "Bạo Tiếu Sủng Phế", image: backgroundImage },
    { title: "Nghịch Kiếm Cuồng Thần", image: backgroundImage },
    { title: "Xấu nữ làm ruộng", image: backgroundImage },
];

const HotStories = () => {
  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6 flex items-center">
        TRUYỆN HOT 🔥
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
        {hotStories.map((story, idx) => (
          <div key={idx} className="relative bg-white rounded overflow-hidden shadow hover:shadow-lg transition">
            <div className="w-full h-40 overflow-hidden">
              <img
                src={story.image}
                alt={story.title}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Gắn nhãn "FULL" nếu có */}
            {story.status === "FULL" && (
              <div className="absolute top-2 left-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">
                FULL
              </div>
            )}
            <div className="p-2 text-sm text-center truncate">
              {story.title}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HotStories;
