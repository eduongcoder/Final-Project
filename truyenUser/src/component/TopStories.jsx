// src/components/TopStories.jsx (Giả sử vị trí file)
import React, { useMemo } from "react"; // Bỏ useEffect, useDispatch
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { User, Book } from "lucide-react";

const TopStories = () => {
  // Chỉ lấy novels từ store, không dispatch lại
  const { novels, loading, error } = useSelector((state) => state.novels);

  // Không còn:
  // const dispatch = useDispatch();
  // useEffect(() => {
  //   dispatch(getAllNovels());
  // }, [dispatch]);

  const renderError = (err) => (typeof err === 'string' ? err : err?.message || 'Đã có lỗi xảy ra.');

  const sectionsData = useMemo(() => {
    if (!novels || novels.length === 0) return [];

    const getAuthorName = (novel) => {
        // API getAllNovels trả về authors: null.
        // Nếu bạn có 1 trường tên tác giả trực tiếp trong novel object (vd: novel.authorName) thì dùng nó
        return "N/A";
    };
    const getGenre = (novel) => {
        // API getAllNovels không trả về categories chi tiết.
        // Nếu có 1 trường thể loại chính (vd: novel.mainCategory) thì dùng nó
        return "N/A";
    };

    const sortedByViews = [...novels].sort((a, b) => (b.viewNovel || 0) - (a.viewNovel || 0));
    const sortedByRating = [...novels].sort((a, b) => (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0));
    const recommended = [...novels]
        .filter(n => !sortedByViews.slice(0,1).map(s => s.idNovel).includes(n.idNovel))
        .sort((a,b) => (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0));

    return [
      {
        title: "Đọc nhiều",
        topStory: sortedByViews[0] ? {
          id: sortedByViews[0].idNovel,
          name: sortedByViews[0].nameNovel,
          author: getAuthorName(sortedByViews[0]),
          genre: getGenre(sortedByViews[0]),
          image: sortedByViews[0].imageNovel || "https://via.placeholder.com/64x96.png?text=N",
        } : null,
        list: sortedByViews.slice(1, 10).map(n => ({id: n.idNovel, name: n.nameNovel})),
      },
      {
        title: "Đánh giá cao",
        topStory: sortedByRating[0] ? {
            id: sortedByRating[0].idNovel,
            name: sortedByRating[0].nameNovel,
            author: getAuthorName(sortedByRating[0]),
            genre: getGenre(sortedByRating[0]),
            image: sortedByRating[0].imageNovel || "https://via.placeholder.com/64x96.png?text=N",
        } : null,
        list: sortedByRating.slice(1, 10).map(n => ({id: n.idNovel, name: n.nameNovel})),
      },
      {
        title: "Đề cử",
        topStory: recommended[0] ? {
            id: recommended[0].idNovel,
            name: recommended[0].nameNovel,
            author: getAuthorName(recommended[0]),
            genre: getGenre(recommended[0]),
            image: recommended[0].imageNovel || "https://via.placeholder.com/64x96.png?text=N",
        } : null,
        list: recommended.slice(1, 10).map(n => ({id: n.idNovel, name: n.nameNovel})),
      },
    ].filter(section => section.topStory && section.topStory.id);
  }, [novels]);

  // Hiển thị loading/error chỉ khi novels thực sự chưa có và đang fetch từ Home
  if (loading && novels.length === 0) return (
    <div className="container mx-auto p-4 sm:p-6">
        <p className="text-center text-gray-500 py-5">Đang tải danh sách truyện...</p>
    </div>
  );

  if (error && novels.length === 0) return (
    <div className="container mx-auto p-4 sm:p-6">
        <p className="text-center text-red-500 py-5">Lỗi tải danh sách truyện: {renderError(error)}</p>
    </div>
  );

  if (!sectionsData || sectionsData.length === 0) return (
    <div className="container mx-auto p-4 sm:p-6">
        <p className="text-center text-gray-500 py-5">Không có dữ liệu truyện để hiển thị.</p>
    </div>
  );

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sectionsData.map((section, idx) => (
          <div key={idx} className="flex flex-col">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">{section.title}</h2>
            {section.topStory && (
              <div className="flex mb-4 items-start">
                <div className="w-16 h-24 overflow-hidden rounded mr-3 flex-shrink-0">
                  <Link to={`/novel/${section.topStory.id}`}>
                    <img
                      src={section.topStory.image}
                      alt={section.topStory.name}
                      className="w-full h-full object-cover"
                    />
                  </Link>
                </div>
                <div className="flex-grow min-w-0">
                  <h3 className="font-bold text-base sm:text-lg leading-tight mb-1">
                    <Link to={`/novel/${section.topStory.id}`} className="hover:text-blue-600 line-clamp-2" title={section.topStory.name}>
                      {section.topStory.name}
                    </Link>
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm flex items-center mb-0.5 truncate">
                    <User size={14} className="mr-1.5 text-gray-500 flex-shrink-0" />
                    {section.topStory.author}
                  </p>
                  <p className="text-gray-600 text-xs sm:text-sm flex items-center truncate">
                    <Book size={14} className="mr-1.5 text-gray-500 flex-shrink-0" />
                    {section.topStory.genre}
                  </p>
                </div>
              </div>
            )}
            <ul className="space-y-1.5 text-sm text-gray-700 flex-grow">
              {section.list.map((item, itemIdx) => (
                <li key={item.id || itemIdx} className="flex items-center"> {/* Dùng item.id làm key nếu có */}
                  <span
                    className={`w-5 h-5 flex items-center justify-center rounded-full text-xs font-semibold mr-2 flex-shrink-0
                      ${itemIdx === 0 ? "bg-yellow-400 text-white" :
                      itemIdx === 1 ? "bg-blue-400 text-white" :
                      itemIdx === 2 ? "bg-orange-400 text-white" :
                      "bg-gray-200 text-gray-600"}`}
                  >
                    {itemIdx + 2}
                  </span>
                  <Link to={`/novel/${item.id}`} className="truncate hover:text-blue-600 hover:underline" title={item.name}>
                    {item.name}
                  </Link>
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