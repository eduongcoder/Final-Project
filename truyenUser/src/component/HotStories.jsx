import React, { useMemo, useState } from "react"; // Thêm useState
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Flame, ChevronDown, ChevronUp } from "lucide-react"; // Thêm ChevronDown, ChevronUp

const HotStories = () => {
  const { novels, loading, error } = useSelector((state) => state.novels);
  const [showAllHotStories, setShowAllHotStories] = useState(false); // State mới

  const renderError = (err) => (typeof err === 'string' ? err : err?.message || 'Đã có lỗi xảy ra.');

  const INITIAL_DISPLAY_COUNT = 9; // Số truyện hiển thị ban đầu
  const MAX_DISPLAY_COUNT = novels.length; // Hoặc một số giới hạn tối đa nếu không muốn hiển thị hết

  const hotStoriesData = useMemo(() => {
    if (!novels || novels.length === 0) return [];
    const sortedNovels = [...novels]
      .sort((a, b) => parseFloat(b.rating || "0") - parseFloat(a.rating || "0"));

    return showAllHotStories ? sortedNovels.slice(0, MAX_DISPLAY_COUNT) : sortedNovels.slice(0, INITIAL_DISPLAY_COUNT);
  }, [novels, showAllHotStories, INITIAL_DISPLAY_COUNT, MAX_DISPLAY_COUNT]);


  if (loading && novels.length === 0) {
    return (
      <div className="container mx-auto p-4 sm:p-6">
        <h2 className="text-2xl font-semibold mb-6 flex items-center text-gray-800">
          TRUYỆN HOT <Flame size={28} className="ml-2 text-red-500" />
        </h2>
        <p className="text-center text-gray-500">Đang tải truyện hot...</p>
      </div>
    );
  }

  if (error && novels.length === 0) {
     return (
      <div className="container mx-auto p-4 sm:p-6">
        <h2 className="text-2xl font-semibold mb-6 flex items-center text-gray-800">
          TRUYỆN HOT <Flame size={28} className="ml-2 text-red-500" />
        </h2>
        <p className="text-center text-red-500">Không thể tải truyện hot. Lỗi: {renderError(error)}</p>
      </div>
    );
  }

  // Chỉ hiển thị nút "Xem thêm" nếu tổng số truyện nhiều hơn số lượng hiển thị ban đầu
  const canShowMore = novels.length > INITIAL_DISPLAY_COUNT;

  if (hotStoriesData.length === 0 && !loading && !error) { // Thêm !error để tránh hiển thị khi có lỗi
     return (
      <div className="container mx-auto p-4 sm:p-6">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold flex items-center text-gray-800">
            TRUYỆN HOT
            <Flame size={28} className="ml-2 text-red-500" />
            </h2>
        </div>
        <p className="text-center text-gray-500">Chưa có truyện hot nào.</p>
      </div>
    );
  }


  return (
    <div className="container mx-auto p-4 sm:p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold flex items-center text-gray-800">
          TRUYỆN HOT
          <Flame size={28} className="ml-2 text-red-500" />
        </h2>
        {/* Nút Xem thêm / Ẩn bớt */}
        {canShowMore && ( // Chỉ hiển thị nút nếu có thể xem thêm
          <button
            onClick={() => setShowAllHotStories(!showAllHotStories)}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center transition-colors"
          >
            {showAllHotStories ? "Ẩn bớt" : "Xem thêm"}
            {showAllHotStories ? <ChevronUp size={18} className="ml-1" /> : <ChevronDown size={18} className="ml-1" />}
          </button>
        )}
      </div>

      {hotStoriesData.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-3 gap-y-4 sm:gap-x-4 sm:gap-y-5">
          {hotStoriesData.map((story) => (
            <div key={story.idNovel} className="relative bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 group">
              <Link to={`/novel/${story.idNovel}`} title={story.nameNovel} className="block">
                <div className="w-full aspect-[3/4] overflow-hidden">
                  <img
                    src={story.imageNovel || "https://via.placeholder.com/150x200.png?text=No+Image"}
                    alt={story.nameNovel}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => { e.target.onerror = null; e.target.src="https://via.placeholder.com/150x200.png?text=Error"; }}
                  />
                </div>
                {story.statusNovel === "COMPLETED" && (
                  <div className="absolute top-2 left-2 bg-green-600 text-white text-xs font-semibold px-1.5 py-0.5 rounded-sm shadow">
                    FULL
                  </div>
                )}
                 {/* Có thể thêm rating ở đây nếu muốn */}
                {/* <div className="absolute top-2 right-2 bg-yellow-400 text-black text-xs font-semibold px-1.5 py-0.5 rounded-sm shadow flex items-center">
                  <Star size={12} className="mr-0.5 fill-current text-yellow-600" /> {parseFloat(story.rating || "0").toFixed(1)}
                </div> */}
                <div className="p-2">
                  <h3 className="text-sm text-gray-800 text-center truncate group-hover:text-blue-600 transition-colors duration-300">
                    {story.nameNovel}
                  </h3>
                </div>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        !loading && <p className="text-center text-gray-500">Không có truyện hot nào để hiển thị.</p>
      )}
    </div>
  );
};

export default HotStories;