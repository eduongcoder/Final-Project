import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';

const DetailPage = () => {
  const storyDetails = {
    title: "Đấu La: Khai Cục Trọng Sinh Biển Sâu Ma Kinh Vương",
    author: "Độc Tinh Thiếu Niên",
    category: "Huyền Huyễn, Cổ Đại",
    status: "Đang ra",
    chapters: 397,
    rating: 4.0,
    description: "Là một truyện được giới thiệu với bạn đọc trên trang đọc truyện hay online. Truyện Đấu La: Khai Cục Trọng Sinh Biển Sâu Ma Kinh Vương là một truyện online hay nhất của tác giả Độc Tinh Thiếu Niên sáng tác thuộc thể loại Huyền huyễn, Cổ Đại.",
    latestChapters: [
      "Chiến đấu vòng chung kết, Diệp Vân, Tu La thần ba...",
      "Cửu Tinh Bá Thể Quyết",
      "Võ Thượng Sát Thần",
      "Nhất Kiếm Độc Tôn"
    ],
    hotStories: [
      "Vạn Cổ Thần Đế",
      "Võ Thượng Thần Đế",
      "Vũ Luyện Điên Phong",
      "Đế Bá",
      "Bắt Đầu Đánh Dấu..."
    ],
    chaptersList: [
      "Chương 1: ta! Thám Hải Ma Kinh Vương?",
      "Chương 2: tiếp thu cùng Dương Tam",
      "Chương 3: đứng sầm tà ma có vôi cỏ hại vực",
      "Chương 4: hành hung Tà Ma Hồ Kinh Vương",
      "Chương 5: Tà Ma Hồ Kinh Vương tham phục, mục tiêu tiếp tục..."
    ]
  };

  const [isChapterOpen, setIsChapterOpen] = useState(false);
  const [showChapters, setShowChapters] = useState(false);

  return (
    <div className="bg-gray-100 p-8">
      <div className="container mx-auto flex space-x-8">
        {/* Phần trái: Giới thiệu truyện và các chương */}
        <div className="flex-1">
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
            {/* Ảnh bìa truyện */}
            <div className="w-1/3 mr-6">
              <img 
                src="https://static.truyenchu.com.vn/Data/dau-la-khai-cuc-trong-sinh-bien-sau-ma-k/300.jpg" // Thay bằng ảnh thật
                alt="Ảnh bìa truyện"
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>

            {/* Thông tin truyện */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">{storyDetails.title}</h1>
              <div className="text-xl text-gray-600">{storyDetails.author}</div>
              <div className="mt-2 text-lg text-gray-500">{storyDetails.category}</div>
              <div className="mt-2 text-lg text-gray-500">{storyDetails.status}</div>
              <div className="mt-2 text-lg text-gray-500">Độ dài: {storyDetails.chapters} Chương</div>

              {/* Đánh giá */}
              <div className="mt-4">
                <div className="flex items-center">
                  <FaStar className="text-yellow-400" />
                  <span className="ml-2 text-lg">{storyDetails.rating} / 5</span>
                </div>
              </div>

              {/* Nút đọc truyện và đánh dấu */}
              <div className="mt-6">
                <button className="py-2 px-6 bg-green-600 text-white rounded-md hover:bg-green-700">
                  Đọc truyện
                </button>
                <button className="mt-2 py-2 px-6 bg-gray-600 text-white rounded-md hover:bg-gray-700">
                  Đánh dấu
                </button>
              </div>
            </div>
          </div>

          {/* Mô tả giới thiệu truyện */}
          {showChapters ? (
            <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold">Danh sách chương</h2>
              <ul className="mt-4 space-y-2">
                {storyDetails.chaptersList.map((chapter, index) => (
                  <li key={index} className="text-gray-700">{chapter}</li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold">Giới thiệu truyện</h2>
              <p className="mt-2 text-gray-700">{storyDetails.description}</p>
            </div>
          )}

          {/* Nút chuyển đổi giữa Giới thiệu truyện và Danh sách chương */}
          <button 
            onClick={() => setShowChapters(!showChapters)} 
            className="mt-4 py-2 px-6 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {showChapters ? "Xem giới thiệu truyện" : "Xem danh sách chương"}
          </button>
        </div>

        {/* Phần phải: Truyện hot */}
        <div className="w-1/4 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold">Truyện Hot</h2>
          <ul className="mt-4 space-y-2">
            {storyDetails.hotStories.map((story, index) => (
              <li key={index} className="text-blue-600 hover:underline">{story}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bình luận */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold">Bình luận truyện</h2>
        <textarea
          className="mt-4 w-full p-3 border border-gray-300 rounded-md"
          rows="4"
          placeholder="Bạn cần đăng nhập để bình luận..."
        ></textarea>
        <div className="mt-4 text-center">
          <button className="py-2 px-6 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Đăng nhập để bình luận
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
