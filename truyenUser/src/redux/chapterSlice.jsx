// src/redux/chapterSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// Bỏ axios gốc nếu không còn API nào dùng nó trong slice này
// import axios from 'axios';
import apiClient from '../services/api'; // Import apiClient cho tất cả các request

// Không cần API_BASE_URL_CHAPTERS nữa vì apiClient đã có baseURL
// const API_BASE_URL_CHAPTERS = "https://truongthaiduongphanthanhvu.onrender.com/chapter";

// Action để lấy danh sách chương cho DetailPage
export const getAllChapters = createAsyncThunk(
  'chapters/getAllChapters',
  async (novelId, { rejectWithValue, dispatch }) => {
    try {
      // Sử dụng apiClient, đường dẫn tương đối
      const response = await apiClient.get(`/chapter/getAll/${novelId}`);
      if (response.data && response.data.code === 1000 && Array.isArray(response.data.result)) {
        const chapters = response.data.result;
        return chapters.sort((a, b) => (a.chapterNumber || a.idChapter) - (b.chapterNumber || b.idChapter));
      }
      return rejectWithValue(response.data?.message || 'Failed to fetch chapters for detail page');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // import { logoutUser } from './userSlice'; // Cần import nếu muốn tự logout
        // dispatch(logoutUser());
        return rejectWithValue('Unauthorized. Please login again.');
      }
      console.error(`Error fetching chapters for DetailPage (novelId: ${novelId}):`, error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || error.message || 'Error fetching chapters for detail page');
    }
  }
);

// Action để lấy danh sách chương đã được map cho dropdown của ReadingPage
export const getNovelChaptersList = createAsyncThunk(
  'chapters/getNovelChaptersList',
  async (novelId, { rejectWithValue, dispatch }) => {
    try {
      const response = await apiClient.get(`/chapter/getAll/${novelId}`);
      if (response.data && response.data.code === 1000 && Array.isArray(response.data.result)) {
        const chapters = response.data.result;
        const sortedChapters = chapters.sort((a, b) => (a.chapterNumber || a.idChapter) - (b.chapterNumber || b.idChapter));
        return sortedChapters.map(chap => ({
          idChapter: chap.idChapter,
          chapterNumber: chap.chapterNumber || chap.idChapter,
          titleChapter: chap.titleChapter
        }));
      }
      return rejectWithValue(response.data?.message || 'Failed to fetch chapters list for reading dropdown');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return rejectWithValue('Unauthorized. Please login again.');
      }
      console.error(`Error fetching chapter list for ReadingPage (novelId: ${novelId}):`, error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || error.message || 'Error fetching chapters list for reading dropdown');
    }
  }
);

// Action để lấy nội dung chi tiết của một chương
export const getChapterContentById = createAsyncThunk(
  'chapters/getChapterContentById',
  async ({ novelId, chapterId }, { rejectWithValue, dispatch }) => { // novelId có thể không cần nếu API chỉ dùng chapterId
    try {
      // Endpoint lấy nội dung chương, giả sử là /chapter/{chapterId} hoặc /chapter/getContent/{chapterId}
      // Nếu API chỉ cần chapterId:
      const response = await apiClient.get(`/chapter/${chapterId}`);
      // Nếu API cần cả novelId và chapterId (ví dụ: /chapter/getContent/{novelId}/{chapterId}):
      // const response = await apiClient.get(`/chapter/getContent/${novelId}/${chapterId}`);

      if (response.data && response.data.code === 1000 && response.data.result) {
        // API tăng view có thể được gọi ở đây hoặc ở backend khi lấy nội dung chương
        // Ví dụ, nếu cần gọi API tăng view riêng:
        // try {
        //   await apiClient.put(`/chapter/increaseViewChapter/${chapterId}`);
        // } catch (viewError) {
        //   console.warn("Failed to increase view for chapter:", chapterId, viewError);
        // }
        return response.data.result;
      }
      return rejectWithValue(response.data?.message || 'Failed to fetch chapter content');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return rejectWithValue('Unauthorized. Please login again.');
      }
      return rejectWithValue(error.response?.data?.message || error.message || 'Error fetching chapter content');
    }
  }
);

// API tăng view cho chapter (nếu bạn muốn gọi riêng, và nó cần token)
export const increaseChapterView = createAsyncThunk(
  'chapters/increaseView',
  async (idChapter, { rejectWithValue, dispatch }) => {
    try {
      // Endpoint của bạn là GET, nhưng thường tăng view là PUT hoặc POST.
      // Nếu là GET và cần token:
      // const response = await apiClient.get(`/chapter/increaseViewChapter/${idChapter}`);
      // Nếu là PUT (phổ biến hơn):
      const response = await apiClient.put(`/chapter/increaseViewChapter/${idChapter}`);

      if (response.data && response.data.code === 1000) { // Hoặc code thành công tương ứng
        return { idChapter, views: response.data.result?.views }; // Trả về thông tin nếu cần cập nhật UI
      }
      return rejectWithValue(response.data?.message || 'Failed to increase chapter view');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return rejectWithValue('Unauthorized.');
      }
      return rejectWithValue(error.response?.data?.message || error.message || 'Error increasing chapter view');
    }
  }
);


// Các actions CRUD khác cho chapter (ví dụ: create, update, delete - đều cần token)
export const createChapter = createAsyncThunk(
  'chapters/createChapter',
  async (chapterData, { rejectWithValue, dispatch }) => {
    try {
      const response = await apiClient.post('/chapter/create', chapterData);
      if (response.data && response.data.code === 1000 && response.data.result) {
        return response.data.result;
      }
      return rejectWithValue(response.data?.message || 'Failed to create chapter');
    } catch (error) { /* ... xử lý lỗi 401 ... */ }
  }
);
// ... (tương tự cho updateChapter, deleteChapter nếu có)


const initialState = {
  chapters: [],
  chaptersForReadingPageDropdown: [],
  currentChapterContent: null,
  loading: false,
  error: null,
  loadingListForReading: false,
  errorListForReading: null,
  loadingContent: false,
  errorContent: null,
  // viewUpdateStatus: null, // Có thể thêm state cho việc cập nhật view
};

const chapterSlice = createSlice({
  name: 'chapters',
  initialState,
  reducers: {
    clearChapterState: (state) => {
      state.chaptersForReadingPageDropdown = [];
      state.currentChapterContent = null;
      state.loadingListForReading = false;
      state.errorListForReading = null;
      state.loadingContent = false;
      state.errorContent = null;
      // state.viewUpdateStatus = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // getAllChapters
      .addCase(getAllChapters.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(getAllChapters.fulfilled, (state, action) => { state.loading = false; state.chapters = action.payload; })
      .addCase(getAllChapters.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      // getNovelChaptersList
      .addCase(getNovelChaptersList.pending, (state) => { state.loadingListForReading = true; state.errorListForReading = null; })
      .addCase(getNovelChaptersList.fulfilled, (state, action) => { state.loadingListForReading = false; state.chaptersForReadingPageDropdown = action.payload; })
      .addCase(getNovelChaptersList.rejected, (state, action) => { state.loadingListForReading = false; state.errorListForReading = action.payload; })

      // getChapterContentById
      .addCase(getChapterContentById.pending, (state) => { state.loadingContent = true; state.errorContent = null; })
      .addCase(getChapterContentById.fulfilled, (state, action) => { state.loadingContent = false; state.currentChapterContent = action.payload; })
      .addCase(getChapterContentById.rejected, (state, action) => { state.loadingContent = false; state.errorContent = action.payload; state.currentChapterContent = null; })

      // increaseChapterView
      .addCase(increaseChapterView.pending, (state) => {
        // state.viewUpdateStatus = 'loading';
      })
      .addCase(increaseChapterView.fulfilled, (state, action) => {
        // state.viewUpdateStatus = 'succeeded';
        // Cập nhật view count trong currentChapterContent nếu cần và nếu API trả về
        if (state.currentChapterContent && state.currentChapterContent.idChapter === action.payload.idChapter && action.payload.views) {
          // state.currentChapterContent.views = action.payload.views; // Giả sử có trường views
        }
      })
      .addCase(increaseChapterView.rejected, (state, action) => {
        // state.viewUpdateStatus = 'failed';
        console.error("Failed to update chapter view:", action.payload);
      })

      // createChapter (ví dụ)
      .addCase(createChapter.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(createChapter.fulfilled, (state, action) => {
        state.loading = false;
        // Thêm chapter mới vào state.chapters hoặc state.chaptersForReadingPageDropdown nếu cần
        if (action.payload && action.payload.idChapter) {
          state.chapters.push(action.payload); // Hoặc unshift()
          // Cân nhắc việc sắp xếp lại state.chapters
        }
      })
      .addCase(createChapter.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const { clearChapterState } = chapterSlice.actions;
export default chapterSlice.reducer;