// src/component/page/readingPage.jsx
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getNovelById } from '../../redux/novelSlice';
import {
  getNovelChaptersList,
  getChapterContentById,
  clearChapterState
} from '../../redux/chapterSlice';

import { FaCog, FaListUl, FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import AudioPlayer from '../AudioPlayer';

const ReadingPage = () => {
  const { novelId, chapterId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentNovel, loading: novelLoading, error: novelError } = useSelector((state) => state.novels);
  const {
    currentChapterContent,
    chaptersForReadingPageDropdown,
    loadingContent,
    errorContent,
    loadingListForReading,
    errorListForReading,
  } = useSelector((state) => state.chapters);

  const [showChapterListDropdown, setShowChapterListDropdown] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [fontSize, setFontSize] = useState(() => parseInt(localStorage.getItem('readingFontSize') || '20', 10));
  const [lineHeight, setLineHeight] = useState(() => parseFloat(localStorage.getItem('readingLineHeight') || '1.8'));
  const [fontFamily, setFontFamily] = useState(() => localStorage.getItem('readingFontFamily') || 'Tahoma');
  const [theme, setTheme] = useState(() => localStorage.getItem('readingTheme') || 'xam-nhat');

  const contentRef = useRef(null);

  const [showAudioPlayer, setShowAudioPlayer] = useState(true);
  const [audioUrl, setAudioUrl] = useState("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3");

  // CHIỀU CAO NAVBAR CHÍNH (thanh "TRUYỆN CHỮ") - ĐO BẰNG DEV TOOLS
  const NAVBAR_MAIN_HEIGHT_PX = 64; // <-- THAY BẰNG CHIỀU CAO THỰC TẾ

  // CHIỀU CAO AUDIO PLAYER (thanh cam) - ĐO BẰNG DEV TOOLS
  // Giá trị 62px là ước tính khi stats hiển thị, 58px khi stats ẩn.
  // Bạn nên dùng giá trị cao nhất có thể hoặc đo khi stats hiển thị.
  const AUDIO_PLAYER_ACTUAL_HEIGHT_PX = 62; // <-- THAY BẰNG CHIỀU CAO THỰC TẾ

  // Padding top cho trang sẽ chỉ là chiều cao của navbar chính
  const pagePaddingTop = `${NAVBAR_MAIN_HEIGHT_PX}px`;

  // Padding bottom cho trang để nội dung không bị AudioPlayer (nếu hiển thị) che
  const pagePaddingBottom = showAudioPlayer ? `${AUDIO_PLAYER_ACTUAL_HEIGHT_PX}px` : '0px';

  // Vị trí top của Header đọc truyện (thanh "Nhất niệm vĩnh hằng")
  // sẽ là ngay dưới navbar chính
  const readingHeaderTopPosition = `${NAVBAR_MAIN_HEIGHT_PX}px`;


  useEffect(() => {
    localStorage.setItem('readingFontSize', fontSize.toString());
    localStorage.setItem('readingLineHeight', lineHeight.toString());
    localStorage.setItem('readingFontFamily', fontFamily);
    localStorage.setItem('readingTheme', theme);
  }, [fontSize, lineHeight, fontFamily, theme]);

  useEffect(() => {
    if (novelId) {
      dispatch(getNovelById(novelId));
      dispatch(getNovelChaptersList(novelId));
    }
    return () => {
      dispatch(clearChapterState());
    };
  }, [dispatch, novelId]);

  useEffect(() => {
    if (novelId && chapterId) {
      dispatch(getChapterContentById({ novelId, chapterId }));
      setShowChapterListDropdown(false);
      setShowSettings(false);
      if (contentRef.current) {
        contentRef.current.scrollTop = 0;
      }
      localStorage.setItem(`lastRead_${novelId}`, chapterId);
    }
  }, [dispatch, novelId, chapterId]);

  const { currentChapterIndex, prevChapterDetails, nextChapterDetails } = useMemo(() => {
    if (!chaptersForReadingPageDropdown || chaptersForReadingPageDropdown.length === 0) {
      return { currentChapterIndex: -1, prevChapterDetails: null, nextChapterDetails: null };
    }
    const currentIndex = chaptersForReadingPageDropdown.findIndex(chap => chap.idChapter === chapterId);
    const prev = currentIndex > 0 ? chaptersForReadingPageDropdown[currentIndex - 1] : null;
    const next = currentIndex < chaptersForReadingPageDropdown.length - 1 ? chaptersForReadingPageDropdown[currentIndex + 1] : null;
    return {
      currentChapterIndex: currentIndex,
      prevChapterDetails: prev,
      nextChapterDetails: next
    };
  }, [chapterId, chaptersForReadingPageDropdown]);

  const currentChapterNumber = currentChapterContent?.chapterNumber;

  // ... (các hàm handlePrevChapter, handleNextChapter, handleChapterSelect, renderErrorText giữ nguyên) ...
  const handlePrevChapter = () => {
    if (prevChapterDetails?.idChapter) {
      navigate(`/novel/${novelId}/chapter/${prevChapterDetails.idChapter}`);
    }
  };

  const handleNextChapter = () => {
    if (nextChapterDetails?.idChapter) {
      navigate(`/novel/${novelId}/chapter/${nextChapterDetails.idChapter}`);
    }
  };

  const handleChapterSelect = (selectedChapterId) => {
    if (selectedChapterId !== chapterId) {
      navigate(`/novel/${novelId}/chapter/${selectedChapterId}`);
    }
    setShowChapterListDropdown(false);
  };

  const isFirstChapter = currentChapterIndex === 0;
  const isLastChapter = chaptersForReadingPageDropdown && currentChapterIndex === chaptersForReadingPageDropdown.length - 1;

  const renderErrorText = (err, type = "Nội dung") => (
    <div className="text-center py-10 text-red-500">
      Lỗi tải {type}: {typeof err === 'string' ? err : (err?.message || 'Đã có lỗi không xác định.')}
    </div>
  );

  if (novelLoading) return <div className="flex justify-center items-center min-h-screen text-xl">Đang tải thông tin truyện...</div>;
  if (novelError) return renderErrorText(novelError, "thông tin truyện");
  if (!currentNovel) return <div className="flex justify-center items-center min-h-screen text-xl">Không tìm thấy thông tin truyện hoặc đang tải...</div>;
  if (loadingListForReading && (!chaptersForReadingPageDropdown || chaptersForReadingPageDropdown.length === 0)) return <div className="flex justify-center items-center min-h-screen text-xl">Đang tải danh sách chương...</div>;
  if (errorListForReading && (!chaptersForReadingPageDropdown || chaptersForReadingPageDropdown.length === 0)) return renderErrorText(errorListForReading, "danh sách chương");
  if (loadingContent && !currentChapterContent) return <div className="flex justify-center items-center min-h-screen text-xl">Đang tải nội dung chương...</div>;
  if (errorContent && !currentChapterContent) return renderErrorText(errorContent, "nội dung chương");
  if (!currentChapterContent || !chaptersForReadingPageDropdown || chaptersForReadingPageDropdown.length === 0) {
    if (chaptersForReadingPageDropdown && chaptersForReadingPageDropdown.length === 0 && !loadingListForReading && !errorListForReading) return <div className="flex justify-center items-center min-h-screen text-xl">Truyện này chưa có chương nào.</div>;
    return <div className="flex justify-center items-center min-h-screen text-xl">Không tìm thấy dữ liệu cần thiết hoặc đang tải...</div>;
  }

  const themeClasses = {
    'xam-nhat': 'bg-gray-100 text-gray-800',
    'den': 'bg-gray-900 text-gray-200',
    'trang': 'bg-white text-gray-900',
  };
  const currentThemeClass = themeClasses[theme] || themeClasses['xam-nhat'];

  return (
    <div
      className={`reading-page min-h-screen flex flex-col ${currentThemeClass} transition-colors duration-300`}
      style={{
        fontFamily: fontFamily,
        paddingTop: 0, // Padding top cho navbar chính
        paddingBottom: 0, // Padding bottom cho AudioPlayer
      }}
    >
      {/* Navbar chính của trang sẽ nằm bên ngoài component này, ở App.js hoặc Layout.js */}
      {/* AudioPlayer sẽ được render ở gần cuối DOM của component này nhưng được định vị fixed */}

      <header
        className={`${theme === 'den' ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-800'} shadow-md py-3 sticky top-0 z-20`}
      >
        {/* ... Nội dung header đọc truyện giữ nguyên ... */}
        <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center">
          <div className="text-center sm:text-left mb-2 sm:mb-0">
            <h1 className="text-xl md:text-2xl font-semibold truncate max-w-xs md:max-w-md lg:max-w-2xl">
              <Link to={`/novel/${novelId}`} className={`${theme === 'den' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} hover:underline`}>
                {currentNovel.nameNovel || 'Tên truyện'}
              </Link>
            </h1>
            <p className={`text-sm ${theme === 'den' ? 'text-gray-400' : 'text-gray-600'}`}>
              Chương {currentChapterNumber || 'N/A'}: {currentChapterContent.titleChapter || 'Tiêu đề chương'}
            </p>
          </div>

          <div className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={handlePrevChapter}
              disabled={isFirstChapter || !prevChapterDetails}
              className={`px-2 py-1.5 sm:px-3 ${theme === 'den' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <FaAngleLeft className="inline mr-1" /> Trước
            </button>

            <div className="relative">
              <button onClick={() => setShowChapterListDropdown(prev => !prev)} className="px-2 py-1.5 sm:px-3 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm w-28 sm:w-32 text-center flex items-center justify-center">
                <FaListUl className="inline mr-1" /> C. {currentChapterNumber || '?'}
                <svg className={`w-3 h-3 sm:w-4 sm:h-4 ml-1 transition-transform duration-200 ${showChapterListDropdown ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              {showChapterListDropdown && chaptersForReadingPageDropdown && chaptersForReadingPageDropdown.length > 0 && (
                <div className={`absolute top-full mt-1 ${theme === 'den' ? 'bg-gray-700 border-gray-600 text-gray-300' : 'bg-white border-gray-300 text-gray-700'} border rounded shadow-lg max-h-60 w-64 sm:w-72 overflow-y-auto z-30`}>
                  {chaptersForReadingPageDropdown.map((chap) => (
                    <button key={chap.idChapter} onClick={() => handleChapterSelect(chap.idChapter)}
                      className={`block w-full text-left px-3 py-2 text-sm truncate ${chap.idChapter === chapterId ? `font-bold ${theme === 'den' ? 'text-blue-300 bg-gray-600' : 'text-blue-600 bg-blue-50'}` : `${theme === 'den' ? 'hover:bg-gray-600' : 'hover:bg-gray-100'}`}`}
                      title={`Chương ${chap.chapterNumber}: ${chap.titleChapter || 'Chưa có tiêu đề'}`}
                    >
                      C. {chap.chapterNumber}: {chap.titleChapter || 'Chưa có tiêu đề'}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={handleNextChapter}
              disabled={isLastChapter || !nextChapterDetails}
              className={`px-2 py-1.5 sm:px-3 ${theme === 'den' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              Sau <FaAngleRight className="inline ml-1" />
            </button>

             <div className="relative">
              <button onClick={() => setShowSettings(prev => !prev)} className={`p-2 ${theme === 'den' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} rounded`} title="Tùy chỉnh"><FaCog /></button>
              {showSettings && (
                <div className={`absolute top-full mt-1 right-0 ${theme === 'den' ? 'bg-gray-800 border-gray-600 text-gray-300' : 'bg-white border-gray-300 text-gray-700'} border rounded shadow-lg p-4 w-60 sm:w-64 z-30`}>
                  <h4 className="text-sm font-semibold mb-3">Tùy Chỉnh</h4>
                  <div className="mb-2"><label className="block text-xs mb-1">Màu nền:</label><select value={theme} onChange={(e) => setTheme(e.target.value)} className={`w-full p-1.5 text-xs border rounded ${theme === 'den' ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-gray-50 border-gray-300 text-gray-800'} focus:outline-none focus:border-blue-500`}><option value="xam-nhat">Xám nhạt</option><option value="den">Đen</option><option value="trang">Trắng</option></select></div>
                  <div className="mb-2"><label className="block text-xs mb-1">Font chữ:</label><select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)} className={`w-full p-1.5 text-xs border rounded ${theme === 'den' ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-gray-50 border-gray-300 text-gray-800'} focus:outline-none focus:border-blue-500`}><option value="Tahoma">Tahoma</option><option value="Arial">Arial</option><option value="Verdana">Verdana</option><option value="'Times New Roman'">Times New Roman</option></select></div>
                  <div className="mb-2"><label className="block text-xs mb-1">Size chữ: {fontSize}px</label><input type="range" min="12" max="32" value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"/></div>
                  <div><label className="block text-xs mb-1">Dãn dòng: {(lineHeight * 100).toFixed(0)}%</label><input type="range" min="1.2" max="2.5" step="0.1" value={lineHeight} onChange={(e) => setLineHeight(parseFloat(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"/></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main ref={contentRef} className="container mx-auto px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 py-8 flex-grow overflow-y-auto">
        <div
          className={`chapter-content prose-lg max-w-none ${theme === 'den' ? 'prose-invert text-gray-300' : ''} ${theme === 'trang' ? 'text-gray-900' : ''} ${theme === 'xam-nhat' ? 'text-gray-800' : ''}`}
          style={{ fontSize: `${fontSize}px`, lineHeight: lineHeight }}
          dangerouslySetInnerHTML={{ __html: currentChapterContent.contentChapter?.replace(/\n/g, '<br />') || 'Nội dung chương đang được cập nhật...' }}
        />
      </main>

      <footer className={`${theme === 'den' ? 'bg-gray-800' : 'bg-white'}  shadow-md py-4 sticky top-0 z-20`}>
        {/* ... Nội dung footer giữ nguyên ... */}
        <div className="container mx-auto px-4 flex justify-center items-center space-x-1 sm:space-x-2">
          <button
            onClick={handlePrevChapter}
            disabled={isFirstChapter || !prevChapterDetails}
            className={`px-2 py-1.5 sm:px-3 ${theme === 'den' ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'} rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <FaAngleLeft className="inline mr-1" /> Trước
          </button>
          <div className="relative">
            <button onClick={() => setShowChapterListDropdown(prev => !prev)} className="px-2 py-1.5 sm:px-3 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm w-28 sm:w-32 text-center flex items-center justify-center">
              <FaListUl className="inline mr-1" /> C. {currentChapterNumber || '?'}
              <svg className={`w-3 h-3 sm:w-4 sm:h-4 ml-1 transition-transform duration-200 ${showChapterListDropdown ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
          </div>
          <button
            onClick={handleNextChapter}
            disabled={isLastChapter || !nextChapterDetails}
            className={`px-2 py-1.5 sm:px-3 ${theme === 'den' ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'} rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            Sau <FaAngleRight className="inline ml-1" />
          </button>
        </div>
      </footer>

      {/* AudioPlayer được render ở đây nhưng sẽ fixed ở bottom-0 */}
      {showAudioPlayer && (
        <AudioPlayer
          audioSrc={audioUrl}
          onPrevChapter={handlePrevChapter}
          onNextChapter={handleNextChapter}
          currentChapterIndexForAudio={currentChapterIndex}
          totalChapters={chaptersForReadingPageDropdown ? chaptersForReadingPageDropdown.length : 0}
          coverImage={currentNovel?.coverImage}
          // Class fixed và bottom-0 đã được đặt trong AudioPlayer.jsx
        />
      )}
    </div>
  );
};

export default ReadingPage;