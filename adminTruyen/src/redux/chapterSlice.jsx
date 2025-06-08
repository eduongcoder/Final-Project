import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios'; // Không dùng axios gốc
import apiClient from '../services/api'; // Sử dụng apiClient đã cấu hình

const apiPath = "/chapter"; // Đường dẫn tương đối

// --- ASYNC THUNKS ---

// Lấy tất cả chapter của một truyện (không cần token nếu là public)
export const getAllChapters = createAsyncThunk(
  'chapters/getAll', 
  async (idNovel, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`${apiPath}/getAll/${idNovel}`);
      return response.data.result;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Lấy chi tiết một chapter (không cần token nếu là public)
export const getChapterById = createAsyncThunk(
  'chapters/getById', 
  async (idChapter, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`${apiPath}/${idChapter}`);
      return response.data.result;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Tạo chapter mới (CẦN TOKEN) - API này dùng FormData
export const createChapter = createAsyncThunk(
  'chapters/create', 
  async ({ request, textFile }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      // Chuyển object JSON thành một Blob và append vào formData
      formData.append('request', new Blob([JSON.stringify(request)], { type: 'application/json' }));
      
      if (textFile) {
        formData.append('textFile', textFile);
      }
      
      // apiClient sẽ tự động thêm token và set Content-Type là multipart/form-data
      const response = await apiClient.post(`${apiPath}/create`, formData);
      return response.data.result;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Cập nhật chapter (CẦN TOKEN) - API này dùng FormData
export const updateChapter = createAsyncThunk(
  'chapters/update', 
  async ({ request, textFile }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('request', new Blob([JSON.stringify(request)], { type: 'application/json' }));
      
      if (textFile) {
        formData.append('textFile', textFile);
      }

      // apiClient sẽ tự động thêm token và set Content-Type là multipart/form-data
      const response = await apiClient.put(`${apiPath}/update`, formData);
      return response.data.result;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Xóa chapter (CẦN TOKEN)
export const deleteChapter = createAsyncThunk(
  'chapters/delete', 
  async (idChapter, { rejectWithValue }) => {
    try {
      await apiClient.delete(`${apiPath}/${idChapter}`);
      // Trả về id của chapter đã xóa để reducer có thể xử lý
      return idChapter;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);


// --- SLICE DEFINITION ---

const chapterSlice = createSlice({
  name: 'chapters',
  initialState: {
    chapters: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // Hàm chung để xử lý pending và rejected
    const handlePending = (state) => {
      state.loading = true;
      state.error = null;
    };
    const handleRejected = (state, action) => {
      state.loading = false;
      state.error = action.payload; // payload từ rejectWithValue
    };

    builder
      // GET ALL
      .addCase(getAllChapters.pending, handlePending)
      .addCase(getAllChapters.fulfilled, (state, action) => {
        state.loading = false;
        state.chapters = action.payload || []; // Đảm bảo là mảng
      })
      .addCase(getAllChapters.rejected, handleRejected)

      // GET BY ID (Cập nhật 1 chapter hoặc thêm nếu chưa có)
      .addCase(getChapterById.pending, handlePending)
      .addCase(getChapterById.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.chapters.findIndex((ch) => ch.idChapter === action.payload.idChapter);
        if (index !== -1) {
          state.chapters[index] = action.payload;
        } else {
          state.chapters.push(action.payload);
        }
      })
      .addCase(getChapterById.rejected, handleRejected)

      // CREATE
      .addCase(createChapter.pending, handlePending)
      .addCase(createChapter.fulfilled, (state, action) => {
        state.loading = false;
        state.chapters.push(action.payload);
      })
      .addCase(createChapter.rejected, handleRejected)

      // UPDATE
      .addCase(updateChapter.pending, handlePending)
      .addCase(updateChapter.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.chapters.findIndex((ch) => ch.idChapter === action.payload.idChapter);
        if (index !== -1) {
          state.chapters[index] = action.payload;
        }
      })
      .addCase(updateChapter.rejected, handleRejected)

      // DELETE
      .addCase(deleteChapter.pending, handlePending)
      .addCase(deleteChapter.fulfilled, (state, action) => {
        state.loading = false;
        // action.payload bây giờ là idChapter đã xóa
        state.chapters = state.chapters.filter((ch) => ch.idChapter !== action.payload);
      })
      .addCase(deleteChapter.rejected, handleRejected);
  }
});

export default chapterSlice.reducer;