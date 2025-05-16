import React from "react";
import backgroundImage from '../assets/anh2.jpg';

const sections = [
    {
        title: "Đọc nhiều",
        topStory: {
            name: "Hỗn độn chi nguyên",
            author: "Khuynh Thiên Hạ",
            genre: "Tiên hiệp",
            image: backgroundImage, // Chỗ này sau này thay link ảnh động
        },
        list: [
            "Từ khai thác lĩnh chủ đến quốc vương",
            "Liệt Dương quan thiên giả",
            "Trọng sinh thành cẩu, khai cực bí vận tàn...",
            "Mọi Người Tu Tiên Ta Làm Ruộng",
            "Toàn cầu cực nóng: Ta ở mặt thể trở hà...",
            "Diamond no Ace | Ngày mùa hè đỏ lửa",
            "Toàn cầu thức tỉnh: Ta kiếp trước đều là...",
            "Cyberpunk: Sparta hành giả",
            "Đem bất chính chi phong thời hướng T...",
        ],
    },
    {
        title: "Thịnh hành",
        topStory: {
            name: "Đỉnh Cấp Khí Vận, Lặng Lẽ Tu Luyện Ngàn Năm",
            author: "Nhâm Ngã Tiếu",
            genre: "Tiên hiệp",
            image: backgroundImage,
        },
        list: [
            "Vạn Cổ Thần Đế",
            "Vừa Thành Tiên Thần, Con Cháu Cầu Ta...",
            "Quang Âm Chi Ngoại",
            "Đế Bá",
            "Từ Hải Nhi Bắt Đầu Nhập Đạo",
            "Bắt Đầu Đánh Đấu Hoang Cổ Thánh Thể",
            "Cầu Tha Tại Nú Ma Đầu Bên Người Vụn...",
            "Đấu La Đại Lục V Trung Sinh Đường Tam",
            "Xích Tâm Tuần Thiên",
        ],
    },
    {
        title: "Đề cử",
        topStory: {
            name: "Ta Ở Thế Giới Khác Ở Trong Giới",
            author: "Nan Hiểu",
            genre: "Huyền huyễn",
            image: backgroundImage,
        },
        list: [
            "Giết Một Người Bạo Một Binh, Bắt Đầu...",
            "Đại Đạo Thủ Càn : Từ Tam Quốc Bắt Đầu",
            "Người Đang Cao Võ Ta Có Thể Mở Phò...",
            "Phân Phái Npc: Bị Người Chơi Công Ki...",
            "Thôn Thiên Võ Thần",
            "Kẻ Hèn Này Chỉ Muốn Kiếm Tiền, Không...",
            "Vừa Thành Nhân Tiên, Nữ Đế Quy Cầu T...",
            "Vòng Đu: Ta Tiễn Thuật Phụ Gia Võ Hồn",
            "Ta Tại Dị Thế Giới Xây Dựng Chủ Thành",
        ],
    },
];

const TopStories = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {sections.map((section, idx) => (
          <div key={idx}>
            <h2 className="text-xl font-semibold mb-4">{section.title}</h2>

            {/* Top 1 */}
            <div className="flex mb-4">
              <div className="w-16 h-24 overflow-hidden rounded mr-4">
                <img
                  src={section.topStory.image}
                  alt={section.topStory.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-bold text-lg">{section.topStory.name}</h3>
                <p className="text-gray-600 text-sm">👤 {section.topStory.author}</p>
                <p className="text-gray-600 text-sm">📚 {section.topStory.genre}</p>
              </div>
            </div>

            {/* Top List */}
            <ul className="space-y-2 text-sm text-gray-700">
              {section.list.map((item, itemIdx) => (
                <li key={itemIdx} className="flex items-center space-x-2">
                  {itemIdx < 3 ? (
                    <span className={`w-5 text-center font-bold ${itemIdx === 0 ? "text-yellow-500" : itemIdx === 1 ? "text-blue-400" : "text-orange-400"}`}>
                      {itemIdx + 2}
                    </span>
                  ) : (
                    <span className="w-5 text-center font-bold">{itemIdx + 1}</span>
                  )}
                  <span className="truncate">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopStories;
