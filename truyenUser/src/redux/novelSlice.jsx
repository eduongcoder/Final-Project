// src/redux/novelSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Các API requests cho Novel
const apiBase = "https://truongthaiduongphanthanhvu.onrender.com/novel";

export const getAllNovels = createAsyncThunk('novels/getAll', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${apiBase}/getAll`);
    if (response.data && response.data.code === 1000) { // Giả sử API trả về code 1000 cho thành công
        return response.data.result;
    }
    return rejectWithValue(response.data?.message || 'Failed to get all novels');
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message || 'Error fetching all novels');
  }
});

export const getNovelById = createAsyncThunk('novels/getById', async (id, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${apiBase}/${id}`);
     if (response.data && response.data.code === 1000) { // Giả sử API trả về code 1000 cho thành công
        return response.data.result;
    }
    return rejectWithValue(response.data?.message || `Failed to get novel with id ${id}`);
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message || `Error fetching novel with id ${id}`);
  }
});

export const createNovel = createAsyncThunk('novels/create', async (data, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${apiBase}/create`, data);
    if (response.data && response.data.code === 1000) { // Giả sử API trả về code 1000 cho thành công
        return response.data.result;
    }
    return rejectWithValue(response.data?.message || 'Failed to create novel');
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message || 'Error creating novel');
  }
});

export const updateNovel = createAsyncThunk('novels/update', async (data, { rejectWithValue }) => {
  try {
    // Giả sử API update cần id trong URL hoặc data.idNovel tồn tại
    // Nếu id trong URL, endpoint có thể là `${apiBase}/update/${data.idNovel}`
    const response = await axios.put(`${apiBase}/update`, data);
    if (response.data && response.data.code === 1000) { // Giả sử API trả về code 1000 cho thành công
        return response.data.result;
    }
    return rejectWithValue(response.data?.message || 'Failed to update novel');
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message || 'Error updating novel');
  }
});

export const deleteNovel = createAsyncThunk('novels/delete', async (id, { rejectWithValue }) => {
  try {
    const response = await axios.delete(`${apiBase}/${id}`);
    // API delete thường trả về id đã xóa hoặc một thông báo thành công trong result
    if (response.data && response.data.code === 1000) { // Giả sử API trả về code 1000 cho thành công
        return id; // Trả về id để dễ dàng filter trong reducer
    }
    return rejectWithValue(response.data?.message || `Failed to delete novel with id ${id}`);
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message || `Error deleting novel with id ${id}`);
  }
});

const novelSlice = createSlice({
  name: 'novels',
  initialState: {
    novels: [],
    currentNovel: null, // << --- THÊM DÒNG NÀY ---
    loading: false,
    error: null
  },
  reducers: {
    // Bạn có thể thêm một reducer để clear currentNovel khi cần
    clearCurrentNovel: (state) => {
      state.currentNovel = null;
      state.error = null; // Cũng có thể clear error liên quan nếu muốn
    }
  },
  extraReducers: (builder) => {
    builder
      // --- getAllNovels ---
      .addCase(getAllNovels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllNovels.fulfilled, (state, action) => {
        state.loading = false;
        state.novels = action.payload;
      })
      .addCase(getAllNovels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message; // Sử dụng action.payload từ rejectWithValue
      })
      // --- getNovelById ---
      .addCase(getNovelById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentNovel = null; // Reset currentNovel khi bắt đầu fetch mới
      })
      .addCase(getNovelById.fulfilled, (state, action) => {
        console.log("getNovelById.fulfilled PAYLOAD:", action.payload);
        state.loading = false;
        state.currentNovel = action.payload;
      })
      .addCase(getNovelById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.currentNovel = null; // Đảm bảo currentNovel là null nếu fetch thất bại
      })
      // --- createNovel ---
      .addCase(createNovel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNovel.fulfilled, (state, action) => {
        state.loading = false;
        console.log("Novel created successfully:", action.payload);
        // Đảm bảo action.payload là một novel object hoàn chỉnh
        if (action.payload && action.payload.idNovel) {
             state.novels.push(action.payload);
        } else {
            console.warn("Create novel fulfilled but payload is not a valid novel object:", action.payload);
        }
      })
      .addCase(createNovel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      // --- updateNovel ---
      .addCase(updateNovel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateNovel.fulfilled, (state, action) => {
        state.loading = false;
        // Cập nhật cả trong danh sách novels và currentNovel (nếu nó là novel đang được update)
        if (action.payload && action.payload.idNovel) {
            const index = state.novels.findIndex((novel) => novel.idNovel === action.payload.idNovel);
            if (index !== -1) {
              state.novels[index] = action.payload;
            }
            if (state.currentNovel && state.currentNovel.idNovel === action.payload.idNovel) {
              state.currentNovel = action.payload;
            }
        } else {
            console.warn("Update novel fulfilled but payload is not a valid novel object:", action.payload);
        }
      })
      .addCase(updateNovel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      // --- deleteNovel ---
      .addCase(deleteNovel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteNovel.fulfilled, (state, action) => {
        state.loading = false;
        // action.payload bây giờ là id của novel đã xóa (từ return id trong thunk)
        state.novels = state.novels.filter((novel) => novel.idNovel !== action.payload);
        if (state.currentNovel && state.currentNovel.idNovel === action.payload) {
          state.currentNovel = null; // Xóa currentNovel nếu nó là novel vừa bị xóa
        }
      })
      .addCase(deleteNovel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  }
});

// Export reducer clearCurrentNovel nếu bạn tạo nó
export const { clearCurrentNovel } = novelSlice.actions;
export default novelSlice.reducer;