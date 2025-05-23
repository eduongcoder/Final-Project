// src/redux/chapterSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// THAY THẾ BẰNG URL API THỰC TẾ CỦA BẠN
const API_BASE_URL_CHAPTERS = "https://truongthaiduongphanthanhvu.onrender.com/chapter";
const API_BASE_URL_NOVELS = "https://truongthaiduongphanthanhvu.onrender.com/novel"; // Hoặc nơi API lấy list chương của truyện

// Action để lấy danh sách chương cho DetailPage
// (Tên này khớp với DetailPage.jsx của bạn)
export const getAllChapters = createAsyncThunk(
  'chapters/getAllChapters',
  async (novelId, { rejectWithValue }) => {
    try {
      // SỬA Ở ĐÂY: Sử dụng API_BASE_URL_CHAPTERS và path đúng
      const response = await axios.get(`${API_BASE_URL_CHAPTERS}/getAll/${novelId}`);
      const chapters = response.data.result || response.data || [];
      return chapters.sort((a, b) => (a.chapterNumber || a.idChapter) - (b.chapterNumber || b.idChapter));
    } catch (error) {
      console.error(`Error fetching chapters for DetailPage (novelId: ${novelId}):`, error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch chapters for detail page');
    }
  }
);

export const getNovelChaptersList = createAsyncThunk(
  'chapters/getNovelChaptersList',
  async (novelId, { rejectWithValue }) => {
    try {
      // SỬA Ở ĐÂY: Sử dụng API_BASE_URL_CHAPTERS và path đúng
      const response = await axios.get(`${API_BASE_URL_CHAPTERS}/getAll/${novelId}`);
      const chapters = response.data.result || response.data || [];
      const sortedChapters = chapters.sort((a, b) => (a.chapterNumber || a.idChapter) - (b.chapterNumber || b.idChapter));
      // Map lại để chỉ lấy các trường cần thiết cho dropdown (tối ưu performance nếu API trả về nhiều dữ liệu)
      return sortedChapters.map(chap => ({
        idChapter: chap.idChapter,
        chapterNumber: chap.chapterNumber || chap.idChapter, // Ưu tiên chapterNumber nếu có
        titleChapter: chap.titleChapter
      }));
    } catch (error) {
      console.error(`Error fetching chapter list for ReadingPage (novelId: ${novelId}):`, error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch chapters list for reading dropdown');
    }
  }
);

// Action để lấy nội dung chi tiết của một chương
// (Tên này khớp với ReadingPage.jsx của bạn)
export const getChapterContentById = createAsyncThunk(
  'chapters/getChapterContentById', // Type prefix
  async ({ novelId, chapterId }, { rejectWithValue }) => { // ReadingPage gửi object { novelId, chapterId }
    try {
      // Endpoint lấy nội dung chương từ API của bạn
      const response = await axios.get(`${API_BASE_URL_CHAPTERS}/${chapterId}`);
      return response.data.result || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch chapter content');
    }
  }
);

// Các actions CRUD khác (nếu bạn cần chúng, đảm bảo chúng cũng xử lý lỗi và cập nhật state đúng cách)
// Ví dụ:
// export const createChapter = createAsyncThunk('chapters/create', async (data, {rejectWithValue}) => { /* ... */ });
// export const updateChapter = createAsyncThunk('chapters/update', async (data, {rejectWithValue}) => { /* ... */ });
// export const deleteChapter = createAsyncThunk('chapters/delete', async (id, {rejectWithValue}) => { /* ... */ });


const chapterSlice = createSlice({
  name: 'chapters',
  initialState: {
    chapters: [], // Danh sách chương cho DetailPage (được sử dụng bởi `getAllChapters`)
    chaptersForReadingPageDropdown: [], // Danh sách chương cho ReadingPage dropdown
    currentChapterContent: null,    // Nội dung chương đang đọc

    // Loading và Error states riêng biệt
    loading: false, // Loading chung cho getAllChapters (DetailPage)
    error: null,   // Error chung cho getAllChapters (DetailPage)

    loadingListForReading: false, // Loading cho danh sách chương dropdown trên ReadingPage
    errorListForReading: null,

    loadingContent: false,     // Loading cho nội dung chương hiện tại
    errorContent: null,
  },
  reducers: {
    // Reducer để dọn dẹp state của ReadingPage khi cần
    clearChapterState: (state) => {
      state.chaptersForReadingPageDropdown = [];
      state.currentChapterContent = null;
      state.loadingListForReading = false;
      state.errorListForReading = null;
      state.loadingContent = false;
      state.errorContent = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // getAllChapters (cho DetailPage)
      .addCase(getAllChapters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllChapters.fulfilled, (state, action) => {
        state.loading = false;
        state.chapters = action.payload; // Cập nhật state `chapters`
      })
      .addCase(getAllChapters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // getNovelChaptersList (cho ReadingPage dropdown)
      .addCase(getNovelChaptersList.pending, (state) => {
        state.loadingListForReading = true;
        state.errorListForReading = null;
      })
      .addCase(getNovelChaptersList.fulfilled, (state, action) => {
        state.loadingListForReading = false;
        state.chaptersForReadingPageDropdown = action.payload;
      })
      .addCase(getNovelChaptersList.rejected, (state, action) => {
        state.loadingListForReading = false;
        state.errorListForReading = action.payload;
      })

      // getChapterContentById (cho ReadingPage)
      .addCase(getChapterContentById.pending, (state) => {
        state.loadingContent = true;
        state.errorContent = null;
        // state.currentChapterContent = null; // Có thể xóa chương cũ ngay khi pending
      })
      .addCase(getChapterContentById.fulfilled, (state, action) => {
        state.loadingContent = false;
        state.currentChapterContent = action.payload;
      })
      .addCase(getChapterContentById.rejected, (state, action) => {
        state.loadingContent = false;
        state.errorContent = action.payload;
        state.currentChapterContent = null; // Xóa nội dung nếu lỗi
      });
      // ... Thêm extraReducers cho các actions CRUD khác nếu có ...
  },
});

export const { clearChapterState } = chapterSlice.actions;
export default chapterSlice.reducer;