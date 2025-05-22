// src/components/HotStories.jsx (Giả sử vị trí file)
import React, { useMemo } from "react"; // Xóa useDispatch khỏi import nếu có
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Flame } from "lucide-react";

const HotStories = () => {
  // const dispatch = useDispatch(); // <<<<<< DÒNG NÀY CẦN XÓA NẾU CÒN
  const { novels, loading, error } = useSelector((state) => state.novels);

  // Không còn useEffect để dispatch(getAllNovels()) ở đây

  const renderError = (err) => (typeof err === 'string' ? err : err?.message || 'Đã có lỗi xảy ra.');

  const hotStoriesData = useMemo(() => {
    if (!novels || novels.length === 0) return [];
    return [...novels]
      .sort((a, b) => parseFloat(b.rating || "0") - parseFloat(a.rating || "0")) // Sắp xếp theo rating
      .slice(0, 12); // Lấy 12 truyện
  }, [novels]);


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

  if (hotStoriesData.length === 0 && !loading) {
     return (
      <div className="container mx-auto p-4 sm:p-6">
        <h2 className="text-2xl font-semibold mb-6 flex items-center text-gray-800">
          TRUYỆN HOT <Flame size={28} className="ml-2 text-red-500" />
        </h2>
        <p className="text-center text-gray-500">Chưa có truyện hot nào.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <h2 className="text-2xl font-semibold mb-6 flex items-center text-gray-800">
        TRUYỆN HOT
        <Flame size={28} className="ml-2 text-red-500" />
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-3 gap-y-4 sm:gap-x-4 sm:gap-y-5">
        {hotStoriesData.map((story) => (
          <div key={story.idNovel} className="relative bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 group">
            <Link to={`/novel/${story.idNovel}`} title={story.nameNovel} className="block">
              <div className="w-full aspect-[3/4] overflow-hidden">
                <img
                  src={story.imageNovel || "https://via.placeholder.com/150x200.png?text=No+Image"}
                  alt={story.nameNovel}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              {story.statusNovel === "COMPLETED" && (
                <div className="absolute top-2 left-2 bg-green-600 text-white text-xs font-semibold px-1.5 py-0.5 rounded-sm shadow">
                  FULL
                </div>
              )}
              <div className="p-2">
                <h3 className="text-sm text-gray-800 text-center truncate group-hover:text-blue-600 transition-colors duration-300">
                  {story.nameNovel}
                </h3>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HotStories;