// src/pages/DetailPage.jsx
import React, { useState, useEffect, useMemo } from 'react'; // Thêm useMemo
import { useParams, Link, useNavigate } from 'react-router-dom'; // Thêm useNavigate
import { useDispatch, useSelector } from 'react-redux';
import { getNovelById } from '../../redux/novelSlice';
import { getAllChapters } from '../../redux/chapterSlice'; // Action này lấy danh sách chương cho tab

import { FaStar, FaBookOpen, FaListUl, FaPlusSquare, FaRegHeart, FaInfoCircle, FaThList, FaAngleRight } from 'react-icons/fa';
import GoToChapterInput from '../GoToChapterInput'; // Đường dẫn component
import PaginationControls from '../PaginationControls'; // Đường dẫn component
import ChapterListDisplay from '../ChapterListDisplay'; // Đường dẫn component

const DetailPage = () => {
  const { novelId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentNovel: novelDetailData, loading: novelLoading, error: novelError } = useSelector((state) => state.novels);
  const { chapters: chaptersFromApiForDetailPage, loading: chaptersLoading, error: chaptersError } = useSelector((state) => state.chapters);
  // chaptersFromApiForDetailPage là danh sách chương cho tab "Danh Sách"

  const [activeTab, setActiveTab] = useState('summary');
  const [currentChapterListPage, setCurrentChapterListPage] = useState(1); // Đổi tên để rõ ràng
  const chaptersPerPageInList = 50;

  useEffect(() => {
    if (novelId) {
      setActiveTab('summary');
      setCurrentChapterListPage(1);
      dispatch(getNovelById(novelId));
      dispatch(getAllChapters(novelId)); // Lấy danh sách chương cho tab
    }
  }, [dispatch, novelId]);

  const renderErrorText = (err) => (typeof err === 'string' ? err : err?.message || 'Đã có lỗi xảy ra.');

  // Sắp xếp và ghi nhớ danh sách chương cho DetailPage
  const sortedChaptersForDetailPage = useMemo(() => {
    if (chaptersFromApiForDetailPage && Array.isArray(chaptersFromApiForDetailPage)) {
      return [...chaptersFromApiForDetailPage].sort((a, b) => (a.chapterNumber || a.idChapter) - (b.chapterNumber || b.idChapter));
    }
    return [];
  }, [chaptersFromApiForDetailPage]);

  const handleReadFirstChapter = () => {
    if (sortedChaptersForDetailPage.length > 0) {
      const firstChapter = sortedChaptersForDetailPage[0];
      if (firstChapter?.idChapter) navigate(`/novel/${novelId}/chapter/${firstChapter.idChapter}`);
      else console.error("Không tìm thấy ID chương đầu tiên.");
    } else if (!chaptersLoading) alert("Truyện này chưa có chương nào hoặc đang tải.");
  };

  const handleReadLatestChapter = () => {
    if (sortedChaptersForDetailPage.length > 0) {
      const latestChapter = sortedChaptersForDetailPage[sortedChaptersForDetailPage.length - 1];
      if (latestChapter?.idChapter) navigate(`/novel/${novelId}/chapter/${latestChapter.idChapter}`);
      else console.error("Không tìm thấy ID chương mới nhất.");
    } else if (!chaptersLoading) alert("Truyện này chưa có chương nào hoặc đang tải.");
  };

  const handleReadContinue = () => {
    const lastReadChapterId = localStorage.getItem(`lastRead_${novelId}`);
    if (lastReadChapterId) {
      // Kiểm tra xem chapterId đó có thực sự thuộc truyện này không (tùy chọn)
      const chapterExists = sortedChaptersForDetailPage.some(ch => ch.idChapter === lastReadChapterId);
      if(chapterExists) {
        navigate(`/novel/${novelId}/chapter/${lastReadChapterId}`);
      } else {
        // Nếu chapterId đã lưu không còn hợp lệ (ví dụ bị xóa), đọc từ đầu
        console.warn(`Chapter ID ${lastReadChapterId} đã lưu không tìm thấy trong danh sách chương hiện tại. Đọc từ đầu.`);
        handleReadFirstChapter();
      }
    } else {
      handleReadFirstChapter();
    }
  };

  if (novelLoading && !novelDetailData) return <div className="flex justify-center items-center min-h-screen text-white text-xl p-10">Đang tải thông tin truyện...</div>;
  if (novelError && !novelDetailData) return <div className="flex justify-center items-center min-h-screen text-red-500 text-xl p-10">Lỗi tải thông tin truyện: {renderErrorText(novelError)}</div>;
  if (!novelDetailData && !novelLoading) return <div className="flex justify-center items-center min-h-screen text-white text-xl p-10">Không tìm thấy truyện.</div>;
  if (!novelDetailData) return null;

  let authorDisplay = novelDetailData.authors?.map(auth => auth.nameAuthor || "N/A").join(', ') || "Chưa rõ tác giả";
  let categoriesDisplay = novelDetailData.categories?.map(cat => cat.nameCategory || "N/A") || ["Chưa phân loại"];
  if (categoriesDisplay.length === 0) categoriesDisplay = ["Chưa phân loại"];


  const storyDetails = {
    title: novelDetailData.nameNovel || "N/A",
    shortDescription: novelDetailData.descriptionNovel ? `${novelDetailData.descriptionNovel.substring(0, 150)}...` : "Đọc truyện chữ...",
    author: authorDisplay,
    ratingValue: parseFloat(novelDetailData.rating) || 0,
    ratingCount: novelDetailData.ratingCount || 0,
    chapters: novelDetailData.totalChapter || sortedChaptersForDetailPage.length || 0,
    views: novelDetailData.viewNovel || "0",
    bookmarks: novelDetailData.followNovel || "0",
    status: novelDetailData.statusNovel || "Đang cập nhật",
    categories: categoriesDisplay,
    coverImage: novelDetailData.imageNovel || "https://via.placeholder.com/200x300.png?text=No+Image",
    heroBackground: novelDetailData.imageNovel || "https://truyenchu.com.vn/theme/images/bg_detail.png",
    fullDescription: novelDetailData.descriptionNovel || "Chưa có mô tả chi tiết.",
    ads: novelDetailData.ads || [{ id: 1, image: "https://tpc.googlesyndication.com/simgad/12350005988817403671" }],
  };

  const totalChapterListPages = Math.ceil((storyDetails.chapters || 0) / chaptersPerPageInList) || 1;
  const currentChaptersForTabDisplay = sortedChaptersForDetailPage.slice(
    (currentChapterListPage - 1) * chaptersPerPageInList,
    currentChapterListPage * chaptersPerPageInList
  );

  const handleGoToChapterInTab = (chapterNum) => {
    const targetChapter = sortedChaptersForDetailPage.find(chap => chap.chapterNumber === chapterNum);
    if (targetChapter?.idChapter) {
      navigate(`/novel/${novelId}/chapter/${targetChapter.idChapter}`);
    } else {
      const targetPage = Math.ceil(chapterNum / chaptersPerPageInList);
      if (targetPage >= 1 && targetPage <= totalChapterListPages) setCurrentChapterListPage(targetPage);
      else alert("Số chương không hợp lệ.");
    }
  };

  const handlePageChangeInTab = (page) => {
    if (page >= 1 && page <= totalChapterListPages) setCurrentChapterListPage(page);
  };

  const handleSortChaptersInTab = () => console.log("Sort chapters in tab");


  const renderStars = (rating) => { /* ... giữ nguyên ... */ };
  const getStatusTextAndColor = (status) => { /* ... giữ nguyên ... */ };
  const novelStatus = getStatusTextAndColor(storyDetails.status);


  return (
    <div className="bg-[#181a1d] text-gray-300 min-h-screen">
      <div className="container mx-auto px-4 py-2 text-sm text-gray-400">
        <Link to="/" className="hover:text-sky-400">Trang Chủ</Link> / <span className="text-gray-200">{storyDetails.title.replace(" - Truyện Chữ", "")}</span>
      </div>

      <div className="py-8 md:py-12 bg-no-repeat bg-cover bg-center relative" style={{ backgroundImage: `url('${storyDetails.heroBackground}')` }}>
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            <div className="w-full md:w-1/4 lg:w-1/5 flex-shrink-0 mx-auto md:mx-0">
              <img src={storyDetails.coverImage} alt={`Bìa truyện ${storyDetails.title}`} className="w-full max-w-[180px] md:max-w-full h-auto rounded-md shadow-lg mx-auto aspect-[2/3] object-cover"/>
            </div>
            <div className="md:w-3/4 lg:w-4/5 text-white text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold">{storyDetails.title}</h1>
              <p className="text-xs md:text-sm text-gray-300 mt-1">{storyDetails.shortDescription}</p>
              <p className="text-sm text-gray-400 mt-2">Tác giả: <a href="#" className="hover:text-sky-400">{storyDetails.author}</a></p>
              <div className="flex items-center justify-center md:justify-start space-x-1 mt-2">
                {renderStars(storyDetails.ratingValue)}
                <span className="text-sm ml-2">({storyDetails.ratingValue.toFixed(1)}/5 {storyDetails.ratingCount > 0 ? ` từ ${storyDetails.ratingCount} lượt` : ''})</span>
              </div>
              <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-3 mt-3 text-sm">
                <div><span className="block text-gray-400">Chương</span><span className="font-semibold text-lg">{storyDetails.chapters}</span></div>
                <div><span className="block text-gray-400">Lượt Xem</span><span className="font-semibold text-lg">{storyDetails.views}</span></div>
                <div><span className="block text-gray-400">Theo dõi</span><span className="font-semibold text-lg">{storyDetails.bookmarks}</span></div>
                {/* <div><span className="block text-gray-400">Trạng thái</span><span className={`font-semibold text-lg ${novelStatus.color}`}>{novelStatus.text}</span></div> */}
              </div>
              <div className="mt-3">
                <span className="text-gray-400 text-sm">Thể Loại: </span>
                {storyDetails.categories.map((cat, idx) => <a key={idx} href="#" className="inline-block bg-gray-700 hover:bg-gray-600 text-xs px-2 py-1 rounded mr-1 mb-1">{cat}</a>)}
              </div>
              <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-2 md:gap-3">
                <button onClick={handleReadFirstChapter} className="flex items-center bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded text-sm"><FaBookOpen className="mr-2" /> Đọc từ đầu</button>
                <button onClick={handleReadContinue} className="flex items-center bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded text-sm"><FaListUl className="mr-2" /> Đọc tiếp</button>
                <button onClick={handleReadLatestChapter} className="flex items-center bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded text-sm"><FaPlusSquare className="mr-2" /> Chương mới nhất</button>
              </div>
              <div className="mt-3 flex flex-wrap justify-center md:justify-start gap-2 md:gap-3">
                <button onClick={() => setActiveTab('summary')} className={`flex items-center ${activeTab === 'summary' ? 'bg-slate-500' : 'bg-slate-700'} hover:bg-slate-600 text-white py-2 px-3 rounded text-xs`}><FaInfoCircle className="mr-1 md:mr-2" /> Giới thiệu</button>
                <button onClick={() => setActiveTab('chapters')} className={`flex items-center ${activeTab === 'chapters' ? 'bg-slate-500' : 'bg-slate-700'} hover:bg-slate-600 text-white py-2 px-3 rounded text-xs`}><FaThList className="mr-1 md:mr-2" /> Danh Sách</button>
                <button className="flex items-center bg-slate-700 hover:bg-slate-600 text-white py-2 px-3 rounded text-xs"><FaRegHeart className="mr-1 md:mr-2" /> Theo dõi</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:flex-grow bg-[#2d3038] text-gray-200 p-6 rounded-lg shadow-lg">
            {activeTab === 'summary' && (
              <div>
                <h2 className="text-xl font-semibold mb-4 border-l-4 border-sky-500 pl-3">Tóm Tắt Nội Dung Truyện {storyDetails.title.replace(" - Truyện Chữ", "")}</h2>
                <div className="prose prose-sm md:prose-base prose-invert max-w-none text-gray-300" dangerouslySetInnerHTML={{ __html: storyDetails.fullDescription.replace(/\n\n/g, '<p><br/></p>').replace(/\n/g, '<br/>') }} />
                <div className="mt-6 pt-4 border-t border-gray-700">
                  <button onClick={handleReadLatestChapter} className="text-sky-400 hover:text-sky-300 font-semibold flex items-center text-sm">
                    Xem Thêm Chương Mới Nhất <FaAngleRight className="ml-1" />
                  </button>
                </div>
              </div>
            )}
            {activeTab === 'chapters' && (
              <div>
                <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-y-3">
                  <h2 className="text-xl font-semibold border-l-4 border-sky-500 pl-3">Danh Sách Chương ({storyDetails.chapters})</h2>
                  <div className="flex items-center space-x-3">
                    <GoToChapterInput onGoToChapter={handleGoToChapterInTab} />
                    <PaginationControls
                        currentPage={currentChapterListPage}
                        totalPages={totalChapterListPages}
                        onPageChange={handlePageChangeInTab}
                        onSort={handleSortChaptersInTab}
                        showSortButton={true}
                    />
                  </div>
                </div>
                {chaptersLoading && !currentChaptersForTabDisplay.length && <p className="text-center py-4">Đang tải danh sách chương...</p>}
                {chaptersError && !currentChaptersForTabDisplay.length && <p className="text-red-500 text-center py-4">Lỗi tải chương. Phiên đăng nhập của bạn có thể đã hết hạn. Vui lòng đăng nhập lại để tiếp tục.</p>}
                {!chaptersLoading && !chaptersError && currentChaptersForTabDisplay.length > 0 && (
                  <ChapterListDisplay
                    chapters={currentChaptersForTabDisplay}
                    novelId={novelId} // Truyền novelId xuống
                  />
                )}
                {!chaptersLoading && !chaptersError && sortedChaptersForDetailPage.length === 0 && (
                  <p className="text-center py-4">Truyện này chưa có chương nào.</p>
                )}
                {/* Pagination dưới danh sách chương nếu cần */}
                {totalChapterListPages > 1 && currentChaptersForTabDisplay.length > 0 && (
                     <div className="flex flex-col sm:flex-row justify-center sm:items-center mt-6 pt-4 border-t border-gray-700 gap-y-3">
                        <PaginationControls
                            currentPage={currentChapterListPage}
                            totalPages={totalChapterListPages}
                            onPageChange={handlePageChangeInTab}
                            showSortButton={false}
                        />
                    </div>
                )}
              </div>
            )}
          </div>
          <div className="w-full md:w-64 lg:w-80 md:flex-shrink-0">
            {storyDetails.ads.map(ad => (
              <div key={ad.id} className="bg-[#2d3038] p-1 rounded-lg shadow-lg mb-6">
                <a href="#" aria-label={`Quảng cáo ${ad.id}`}><img src={ad.image} alt={`Quảng cáo ${ad.id}`} className="w-full h-auto rounded-md object-contain"/></a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
// Các hàm renderStars và getStatusTextAndColor bạn giữ nguyên
const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    return (
      <>
        {[...Array(fullStars)].map((_, i) => <FaStar key={`full-${i}`} className="text-yellow-400" />)}
        {halfStar && <FaStar key="half" className="text-yellow-400" />}
        {[...Array(emptyStars)].map((_, i) => <FaStar key={`empty-${i}`} className="text-gray-300" />)}
      </>
    );
};

const getStatusTextAndColor = (status) => {
    switch (status) {
      case 'COMPLETED': return { text: 'Hoàn thành', color: 'text-green-400' };
      case 'CONTINUE': return { text: 'Đang ra', color: 'text-yellow-400' };
      case 'DROP': return { text: 'Tạm ngưng', color: 'text-red-400' };
      default: return { text: 'Đang cập nhật', color: 'text-gray-400' };
    }
};
export default DetailPage;