import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios'; // Không dùng axios gốc nữa
import apiClient from '../services/api'; // BƯỚC 1: Import apiClient

// Các API requests cho Novel
// baseURL đã được định nghĩa trong apiClient, nên ta chỉ cần đường dẫn tương đối
const apiPath = "/novel";

// Giả sử API này không cần token (ai cũng xem được)
export const getAllNovels = createAsyncThunk('novels/getAll', async (_, { rejectWithValue }) => {
  try {
    // Nếu không cần token, có thể dùng apiClient hoặc axios gốc đều được
    const response = await apiClient.get(`${apiPath}/getAll`);
    return response.data.result;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Giả sử các API dưới đây ĐỀU CẦN TOKEN để xác thực admin
export const getNovelById = createAsyncThunk('novels/getById', async (id, { rejectWithValue }) => {
  try {
    const response = await apiClient.get(`${apiPath}/${id}`);
    // apiClient sẽ tự động đính kèm token
    return response.data; // Giả sử API này trả về toàn bộ response.data
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const createNovel = createAsyncThunk('novels/create', async (novelData, { rejectWithValue }) => {
  try {
    const response = await apiClient.post(`${apiPath}/create`, novelData);
    return response.data.result;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const updateNovel = createAsyncThunk('novels/update', async (novelData, { rejectWithValue }) => {
  try {
    // API của bạn có thể dùng /update/{id} hoặc nhận id trong body
    // Ở đây giả định nhận id trong body của novelData
    const response = await apiClient.put(`${apiPath}/update`, novelData);
    return response.data.result;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const deleteNovel = createAsyncThunk('novels/delete', async (id, { rejectWithValue }) => {
  try {
    const response = await apiClient.delete(`${apiPath}/${id}`);
    // Backend nên trả về id của novel đã xóa để dễ xử lý ở frontend
    // Nếu backend không trả về gì, ta có thể trả về id đã gửi đi
    return id; // Trả về id để reducer có thể lọc ra
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const novelSlice = createSlice({
  name: 'novels',
  initialState: {
    novels: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET ALL
      .addCase(getAllNovels.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(getAllNovels.fulfilled, (state, action) => {
        state.loading = false;
        state.novels = action.payload;
      })
      .addCase(getAllNovels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
      })
      // CREATE
      .addCase(createNovel.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(createNovel.fulfilled, (state, action) => {
        state.loading = false;
        state.novels.push(action.payload);
      })
      .addCase(createNovel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
      })
      // UPDATE
      .addCase(updateNovel.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(updateNovel.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.novels.findIndex((novel) => novel.idNovel === action.payload.idNovel);
        if (index !== -1) {
          state.novels[index] = action.payload;
        }
      })
      .addCase(updateNovel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
      })
      // DELETE
      .addCase(deleteNovel.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(deleteNovel.fulfilled, (state, action) => {
        state.loading = false;
        // action.payload bây giờ là id đã xóa
        state.novels = state.novels.filter((novel) => novel.idNovel !== action.payload);
      })
      .addCase(deleteNovel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
      });
      // Bạn có thể thêm các case khác (getById) nếu cần xử lý state riêng
  }
});

export default novelSlice.reducer;