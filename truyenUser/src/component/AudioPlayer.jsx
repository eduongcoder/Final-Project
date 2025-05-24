// src/components/AudioPlayer/AudioPlayer.jsx
import React, { useState, useRef, useEffect } from 'react';
import {
  FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaStepBackward, FaStepForward,
  FaFastBackward, FaFastForward, FaEllipsisV, FaMoon
} from 'react-icons/fa';
import { IoMdSunny } from "react-icons/io"; // Icon cho chế độ sáng (ví dụ)

// Dữ liệu giả định cho các yếu tố hiển thị từ hình ảnh
const MOCK_STATS = {
  chapters: "6905",
  reads: "2400526",
  ratings: "1"
};
// URL ảnh bìa giả định, bạn nên thay thế bằng ảnh thật hoặc truyền qua props
const MOCK_COVER_IMAGE_URL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAKrSURBVFhH7ZfRbhxFFIDfbVXaVChAVMCSjUUGXIAx0LmyuAJHyoQLN8GFG9GiIyEHiB0kLgwZARKyEWgkTQoFId0oJdHdNLVPdT89vl/Vqc5B//RcvupV1VPTU9X7qdP5H9QKVLVTNQA9QL3APKAfsLVb9QG2AVuAacAUYBjQDoT3A0kNaARaAduBqg07A7cA84A2oF+T9LBgK2AW0IlIsG0AAS5P0y2AbWACMAo4YgY7gSRTtVPaDBRklj2lTDDgTWDnB3A7EOokKj1QNoOk+V5M9AwQW5fS7gPqjJNJHLbBOkEfdHBmKgK8BvS7SfoR2AYkPZoWnN0A3P15hKj3P9uB6ZBUzVCk+QN4y7qQpP2W7A5EfcDkG2QnARsCb1fVd0n6CrAZyM1d0PciAP8a0J9Jejh5R8kGZD9tYMyK1N02Ad8DgiQpLwK3XvN61zTfR2aA8fXgG8BLwGvAEaANyA2yT0l6GNgCJPQQ8xclnRNpXUvSOEp6bK6G1FvTVqTmkfQLMAHISgHqgBTgLSAH2KzcDuQG2SfAcTYb8CDwGvBGpLfM0xZkIWAr0EukPUsKAb0aY1lPmgNbgDyAylp7SyNpH/MLeUUMQUb8P1A7U+p9RSm3cvykG0DdZzSgP1Hqa7UBrQEbIJcHkP2QfQYkHVZbr0y0PwCftoB/ATBfpnEtd2EslK4rK3IA2QesAzYBSYE3QNcBlQbtAZsAnYDBAI/k9kf0s2A7MLlFmgPYBJS7uXZE67gXWwO0bUAD4LpLtkugfYBLQD2gK5DtQG6A7QE0RMg2IKsB9UCLsC4q0kQDpPmB7EAfUB8oBaYBOwCzUnQvQBEQf0sV8P4B9tEGoN+PAAAAAElFTkSuQmCC";

// Helper để thêm CSS tùy chỉnh (ví dụ: cho thumb của range input)
const CustomPlayerStyles = () => (
  <style>{`
    .custom-range-thumb::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 10px; /* Kích thước của thumb */
      height: 10px;
      background-color: #334155; /* Màu của thumb (slate-700) */
      border-radius: 50%;
      cursor: pointer;
      margin-top: -3.25px; /* Điều chỉnh vị trí thumb cho vừa với track (track h-1.5 ~ 6px) */
    }
    .custom-range-thumb::-moz-range-thumb {
      width: 10px;
      height: 10px;
      background-color: #334155;
      border-radius: 50%;
      cursor: pointer;
      border: none;
    }
    .custom-range-thumb::-ms-thumb {
      width: 10px;
      height: 10px;
      background-color: #334155;
      border-radius: 50%;
      cursor: pointer;
      border: none;
    }
    /* Style cho text siêu nhỏ của mũi tên dropdown */
    .tiny-arrow {
      font-size: 0.6rem; /* Hoặc kích thước phù hợp */
      line-height: 1;   /* Để căn chỉnh tốt hơn */
      vertical-align: middle;
    }
  `}</style>
);


const AudioPlayer = ({
  audioSrc, // Link audio .mp3
  onPrevChapter, // Hàm xử lý khi nhấn nút "Chương trước"
  onNextChapter, // Hàm xử lý khi nhấn nút "Chương sau"
  currentChapterIndexForAudio = -1, // Index của chương hiện tại (để disable nút)
  totalChapters = 0, // Tổng số chương (để disable nút)
  coverImage, // URL ảnh bìa của truyện
  className = '', // Class tùy chỉnh cho container
}) => {
  const audioRef = useRef(null); // Tham chiếu đến thẻ <audio>
  const [isPlaying, setIsPlaying] = useState(false); // Trạng thái đang phát/dừng
  const [currentTime, setCurrentTime] = useState(0); // Thời gian hiện tại của audio
  const [duration, setDuration] = useState(0); // Tổng thời lượng audio
  const [volume, setVolume] = useState(1); // Âm lượng (0 đến 1), hiện chưa có slider
  const [isMuted, setIsMuted] = useState(false); // Trạng thái tắt tiếng
  const [isDarkModeInPlayer, setIsDarkModeInPlayer] = useState(true); // Giả định player đang ở dark mode dựa trên icon FaMoon

  // Effect này chạy khi audioSrc thay đổi hoặc component được mount
  useEffect(() => {
    const audio = audioRef.current;
    if (audio && audioSrc) {
      // Reset trạng thái khi có audioSrc mới
      setIsPlaying(false);
      setCurrentTime(0);
      // audio.load(); // Có thể cần nếu trình duyệt không tự load src mới

      const setAudioData = () => {
        setDuration(audio.duration || 0);
        setCurrentTime(audio.currentTime || 0);
      };
      const setAudioTime = () => setCurrentTime(audio.currentTime || 0);
      const handleAudioEnd = () => {
        setIsPlaying(false);
        // Tùy chọn: tự động chuyển chương tiếp theo
        // if (onNextChapter) onNextChapter();
      };

      audio.addEventListener('loadedmetadata', setAudioData);
      audio.addEventListener('timeupdate', setAudioTime);
      audio.addEventListener('ended', handleAudioEnd);

      audio.volume = isMuted ? 0 : volume; // Áp dụng trạng thái mute/volume

      return () => { // Cleanup khi component unmount hoặc audioSrc thay đổi
        audio.removeEventListener('loadedmetadata', setAudioData);
        audio.removeEventListener('timeupdate', setAudioTime);
        audio.removeEventListener('ended', handleAudioEnd);
      };
    } else if (audio) {
      // Nếu không có audioSrc (ví dụ: audioSrc là null)
      audio.pause();
      setDuration(0);
      setCurrentTime(0);
      setIsPlaying(false);
    }
  }, [audioSrc]); // Phụ thuộc vào audioSrc

  // Effect để cập nhật âm lượng thực tế của thẻ audio khi volume hoặc isMuted thay đổi
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (audio && audioSrc) { // Chỉ thực hiện nếu có audio và link audio
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play().catch(error => console.error("Lỗi khi phát audio:", error));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (event) => {
    const audio = audioRef.current;
    if (audio && duration > 0) { // Chỉ seek nếu có duration
      const seekToTime = (parseFloat(event.target.value) / 100) * duration;
      audio.currentTime = seekToTime;
      setCurrentTime(seekToTime);
    }
  };

  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds) || timeInSeconds === Infinity || timeInSeconds < 0) return '0:00';
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const toggleMute = () => setIsMuted(!isMuted);

  const rewind = (seconds = 10) => { // Tua lại
    if (audioRef.current && duration > 0) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - seconds);
    }
  };

  const fastForward = (seconds = 10) => { // Tua tới
    if (audioRef.current && duration > 0) {
      audioRef.current.currentTime = Math.min(duration, audioRef.current.currentTime + seconds);
    }
  };

  const togglePlayerDarkMode = () => setIsDarkModeInPlayer(!isDarkModeInPlayer);

  // Điều kiện để disable nút "Chương trước" / "Chương sau"
  const isFirstChapterForAudio = currentChapterIndexForAudio === 0;
  const isLastChapterForAudio = totalChapters > 0 && currentChapterIndexForAudio === totalChapters - 1;

  return (
    <>
      <CustomPlayerStyles />
      <div className={`fixed bottom-0 left-0 right-0 z-50 bg-orange-400 text-black p-2 shadow-lg flex items-center justify-between space-x-2 sm:space-x-3 ${className}`}>
        {/* 1. Bên trái: Ảnh bìa + Thông số */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          <img
            src={coverImage || MOCK_COVER_IMAGE_URL}
            alt="Bìa truyện"
            className="w-10 h-10 object-cover rounded-sm"
            onError={(e) => { e.target.onerror = null; e.target.src=MOCK_COVER_IMAGE_URL; }} // Fallback nếu ảnh lỗi
          />
          <div className="text-xs leading-tight hidden sm:block"> {/* Ẩn thông số trên màn hình rất nhỏ */}
            <p><span className="font-bold">{MOCK_STATS.chapters}</span> Chương</p>
            <p><span className="font-bold">{MOCK_STATS.reads}</span> Lượt đọc</p>
            <p><span className="font-bold">{MOCK_STATS.ratings}</span> Đánh giá</p>
          </div>
        </div>

        {/* 2. Ở giữa: Bộ điều khiển trong hộp bo tròn màu xám nhạt */}
        <div className="flex-grow bg-slate-100/90 backdrop-blur-sm rounded-lg p-1.5 sm:p-2 flex items-center justify-between space-x-1.5 sm:space-x-2 min-w-0">
          {/* 2a. Nút điều khiển phát nhạc */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 md:space-x-3">
            <button onClick={onPrevChapter} disabled={isFirstChapterForAudio || !onPrevChapter} className="text-base sm:text-lg md:text-xl hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed" title="Chương trước"><FaStepBackward /></button>
            <button onClick={() => rewind(10)} className="text-base sm:text-lg md:text-xl hover:text-gray-700 disabled:!duration-0" title="Tua lại 10 giây" disabled={!duration}><FaFastBackward /></button>
            <button onClick={togglePlayPause} className="text-xl sm:text-2xl md:text-3xl hover:text-gray-700 disabled:!duration-0" title={isPlaying ? "Tạm dừng" : "Phát"} disabled={!audioSrc || !duration}>
              {isPlaying ? <FaPause className="text-orange-500" /> : <FaPlay className="text-orange-500" />}
            </button>
            <button onClick={() => fastForward(10)} className="text-base sm:text-lg md:text-xl hover:text-gray-700 disabled:!duration-0" title="Tua tới 10 giây" disabled={!duration}><FaFastForward /></button>
            <button onClick={onNextChapter} disabled={isLastChapterForAudio || !onNextChapter} className="text-base sm:text-lg md:text-xl hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed" title="Chương sau"><FaStepForward /></button>
          </div>

          {/* 2b. Hiển thị thời gian & Thanh tiến trình */}
          <div className="flex-grow flex items-center space-x-2 mx-1 sm:mx-2 min-w-[120px] sm:min-w-[180px] md:min-w-[220px]">
            <span className="text-xs font-medium whitespace-nowrap">{formatTime(currentTime)} / {formatTime(duration)}</span>
            <input
              type="range"
              min="0"
              max="100"
              value={duration > 0 ? (currentTime / duration) * 100 : 0}
              onChange={handleSeek}
              className="w-full h-1.5 bg-gray-400 rounded-lg appearance-none cursor-pointer accent-slate-700 custom-range-thumb disabled:bg-gray-300"
              disabled={!duration || duration === 0}
              title="Seek"
            />
          </div>

          {/* 2c. Âm lượng & Tùy chọn khác */}
          <div className="flex items-center space-x-1 sm:space-x-1.5">
            <button onClick={toggleMute} className="text-base sm:text-lg hover:text-gray-700" title={isMuted ? "Bật tiếng" : "Tắt tiếng"}>
              {isMuted || volume === 0 ? <FaVolumeMute /> : <FaVolumeUp />}
            </button>
            <button className="text-sm sm:text-base hover:text-gray-700" title="Tùy chọn thêm">
              <FaEllipsisV />
            </button>
          </div>
        </div>

        {/* 3. Bên phải: Hẹn giờ, Giọng đọc, Chuyển chế độ Sáng/Tối */}
        <div className="flex items-center space-x-1 sm:space-x-1.5 flex-shrink-0">
          <div className="relative">
            <button className="text-xs px-1 py-0.5 sm:px-2 sm:py-1 border border-black/60 rounded hover:bg-black/10 transition-colors flex items-center">
              Hẹn giờ <span className="ml-0.5 sm:ml-1 tiny-arrow">▾</span>
            </button>
            {/* Dropdown Hẹn giờ sẽ ở đây */}
          </div>
          <div className="relative">
            <button className="text-xs px-1 py-0.5 sm:px-2 sm:py-1 border border-black/60 rounded hover:bg-black/10 transition-colors flex items-center">
              Giọng đọc <span className="ml-0.5 sm:ml-1 tiny-arrow">▾</span>
            </button>
            {/* Dropdown Giọng đọc sẽ ở đây */}
          </div>
          <button onClick={togglePlayerDarkMode} className="p-1 sm:p-1.5 bg-slate-800 text-white rounded-md hover:bg-slate-700" title={isDarkModeInPlayer ? "Chế độ sáng" : "Chế độ tối"}>
            {isDarkModeInPlayer ? <FaMoon className="text-sm sm:text-base" /> : <IoMdSunny className="text-sm sm:text-base" />}
          </button>
        </div>

        {/* Thẻ audio ẩn, dùng để phát nhạc */}
        <audio
          ref={audioRef}
          src={audioSrc || ""} // Đảm bảo src không bao giờ là null
          preload="metadata" // Tải trước metadata để lấy duration
        />
      </div>
    </>
  );
};

export default AudioPlayer;