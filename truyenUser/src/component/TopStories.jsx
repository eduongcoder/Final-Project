// src/components/TopStories.jsx
import React, { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { User, Book } from "lucide-react";

// Giả sử categories vẫn được fetch riêng và có slice tương ứng
// Nếu không, bạn có thể bỏ qua phần liên quan đến categories hoặc lấy categories từ novel nếu có
import { getAllCategories } from "../redux/categorySlice"; // Điều chỉnh đường dẫn nếu cần

const TopStories = () => {
  const dispatch = useDispatch();

  // Lấy dữ liệu từ store
  const { novels, loading: novelsLoading, error: novelsError } = useSelector((state) => state.novels);
  // Không cần lấy authors từ store nữa
  // const { authors, loading: authorsLoading, error: authorsError } = useSelector((state) => state.authors);
  const { categories, loading: categoriesLoading, error: categoriesError } = useSelector((state) => state.categories);

  // Fetch categories nếu chưa có (giả sử categories vẫn được quản lý riêng)
  // Nên thực hiện việc fetch này ở component cha (ví dụ: HomePage)
  useEffect(() => {
    if (!categories || categories.length === 0 && !categoriesLoading) {
      dispatch(getAllCategories());
    }
  }, [dispatch, categories, categoriesLoading]);


  const renderError = (err, type) => (typeof err === 'string' ? err : err?.message || `Đã có lỗi xảy ra khi tải ${type}.`);

  const sectionsData = useMemo(() => {
    // Chỉ cần novels và categories (nếu categories vẫn được dùng)
    if (!novels || novels.length === 0 || !categories) {
        console.log("TopStories: novels hoặc categories chưa sẵn sàng", {novelsLength: novels?.length, categoriesExists: !!categories });
        return [];
    }

    // Tạo map để tra cứu nhanh tên thể loại (nếu cần)
    // Nếu categories được nhúng trong novel, logic này sẽ khác
    const categoryMap = new Map(categories.map(category => [category.idCategory, category.nameCategory]));

    const getAuthorName = (novel) => {
      // Lấy tên tác giả từ mảng novel.authors
      if (novel.authors && novel.authors.length > 0) {
        // Lấy tên của tác giả đầu tiên, hoặc nối tên nhiều tác giả
        return novel.authors.map(author => author.nameAuthor).join(', ');
      }
      return "Chưa rõ"; // Fallback
    };

    const getGenre = (novel) => {
      // Logic lấy thể loại có thể giữ nguyên nếu novel.listCategory vẫn tồn tại
      // Hoặc nếu categories được nhúng trong novel theo cách khác, cần điều chỉnh ở đây
      if (novel.categories && novel.categories.length > 0) { // Giả sử novel giờ có trường categories
        // Lấy tên của category đầu tiên trong danh sách
        return novel.categories[0].nameCategory || "Chưa rõ";
      }
      // Fallback nếu dùng categoryMap từ state.categories
      // if (novel.categoryIds && novel.categoryIds.length > 0) { // Nếu novel có mảng id thể loại
      //   return categoryMap.get(novel.categoryIds[0]) || "Chưa rõ";
      // }
      return "Chưa rõ"; // Fallback nếu không có category
    };

    // Sắp xếp và lọc truyện (logic này có thể giữ nguyên)
    const sortedByViews = [...novels].sort((a, b) => (b.viewNovel || 0) - (a.viewNovel || 0));
    const sortedByRating = [...novels].sort((a, b) => (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0));

    // Lọc ra các truyện không nằm trong top 1 của sortedByViews để tránh trùng lặp
    const topViewId = sortedByViews.length > 0 ? sortedByViews[0].idNovel : null;
    const recommended = [...novels]
        .filter(n => n.idNovel !== topViewId) // Loại bỏ truyện top view nếu có
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
  }, [novels, categories]); // Bỏ authors khỏi dependency

  // Xử lý loading và error
  if (novelsLoading && (!novels || novels.length === 0)) {
    return (
      <div className="container mx-auto p-4 sm:p-6">
          <p className="text-center text-gray-500 py-5">Đang tải danh sách truyện...</p>
      </div>
    );
  }
  // Kiểm tra categoriesLoading nếu categories vẫn được fetch riêng và là bắt buộc
  if (categoriesLoading && (!categories || categories.length === 0)) {
     return (
      <div className="container mx-auto p-4 sm:p-6">
          <p className="text-center text-gray-500 py-5">Đang tải thể loại...</p>
      </div>
    );
  }


  if (novelsError && (!novels || novels.length === 0)) {
    return (
      <div className="container mx-auto p-4 sm:p-6">
          <p className="text-center text-red-500 py-5">Lỗi tải danh sách truyện: {renderError(novelsError, 'truyện')}</p>
      </div>
    );
  }
  // Thêm xử lý lỗi cho categoriesError nếu cần
  if (categoriesError && (!categories || categories.length === 0)) {
    return (
      <div className="container mx-auto p-4 sm:p-6">
          <p className="text-center text-red-500 py-5">Lỗi tải thể loại: {renderError(categoriesError, 'thể loại')}</p>
      </div>
    );
  }

  if (!sectionsData || sectionsData.length === 0) {
    // Thêm kiểm tra nếu novels có nhưng không đủ để tạo section
    if (novels && novels.length > 0 && (!categories || categories.length === 0) && categoriesLoading) {
        // Trường hợp này là đang đợi categories, có thể hiển thị loading khác
        return (
            <div className="container mx-auto p-4 sm:p-6">
                <p className="text-center text-gray-500 py-5">Đang chờ dữ liệu thể loại...</p>
            </div>
        );
    }
    return (
    <div className="container mx-auto p-4 sm:p-6">
        <p className="text-center text-gray-500 py-5">Không có dữ liệu truyện nổi bật để hiển thị.</p>
    </div>
  );
}

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
                <li key={item.id || itemIdx} className="flex items-center">
                  <span
                    className={`w-5 h-5 flex items-center justify-center rounded-full text-xs font-semibold mr-2 flex-shrink-0
                      ${itemIdx === 0 ? "bg-yellow-400 text-white" :
                      itemIdx === 1 ? "bg-blue-400 text-white" :
                      itemIdx === 2 ? "bg-orange-400 text-white" :
                      "bg-gray-200 text-gray-600"}`}
                  >
                    {itemIdx + 2} {/* Số thứ tự bắt đầu từ 2 */}
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