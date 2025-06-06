// src/redux/novelSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios'; // axios gốc cho các API public/whitelist
import apiClient from '../services/api'; // apiClient cho các API cần xác thực

const publicApiBaseNovel = "https://truongthaiduongphanthanhvu.onrender.com/novel"; // Cho API public

// API GET ALL NOVELS (Whitelist - không cần token)
export const getAllNovels = createAsyncThunk(
  'novels/getAll',
  async (_, { rejectWithValue }) => {
    try {
      // Sử dụng axios gốc vì đây là API public
      const response = await axios.get(`${publicApiBaseNovel}/getAll`);
      if (response.data && response.data.code === 1000 && Array.isArray(response.data.result)) {
        return response.data.result;
      }
      return rejectWithValue(response.data?.message || 'Failed to get all novels');
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Error fetching all novels');
    }
  }
);

// API GET NOVEL BY ID (Whitelist - không cần token)
export const getNovelById = createAsyncThunk(
  'novels/getById',
  async (id, { rejectWithValue }) => {
    try {
      // Sử dụng axios gốc vì đây là API public
      // Giả sử endpoint là /novel/{id} hoặc /novel/getById/{id}
      // Nếu là /novel/{id}
      const response = await axios.get(`${publicApiBaseNovel}/${id}`);
      // Nếu là /novel/getById/{id}
      // const response = await axios.get(`${publicApiBaseNovel}/getById/${id}`);

      if (response.data && response.data.code === 1000 && response.data.result) {
        return response.data.result;
      }
      return rejectWithValue(response.data?.message || `Failed to get novel with id ${id}`);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || `Error fetching novel with id ${id}`);
    }
  }
);

// API CREATE NOVEL (YÊU CẦU TOKEN)
export const createNovel = createAsyncThunk(
  'novels/create',
  async (novelData, { rejectWithValue }) => {
    try {
      // Sử dụng apiClient để tự động gửi token
      const response = await apiClient.post('/novel/create', novelData, { // Đường dẫn tương đối với baseURL của apiClient
        headers: { 'Content-Type': 'application/json' }, // Vẫn có thể thêm header khác nếu cần
      });
      if (response.data && response.data.code === 1000 && response.data.result) {
        return response.data.result;
      }
      return rejectWithValue(response.data?.message || 'Failed to create novel');
    } catch (error) {
      // Xử lý lỗi 401/403 nếu cần
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        return rejectWithValue('Unauthorized or Forbidden. Please login again.');
      }
      return rejectWithValue(error.response?.data?.message || error.message || 'Error creating novel');
    }
  }
);

// API UPDATE NOVEL (YÊU CẦU TOKEN)
export const updateNovel = createAsyncThunk(
  'novels/update',
  // Giả sử bạn truyền { idNovel, novelUpdateData }
  async ({ idNovel, novelUpdateData }, { rejectWithValue }) => {
    try {
      // Sử dụng apiClient
      // Endpoint có thể là /novel/update/{idNovel} hoặc /novel/update (với id trong body)
      // Ví dụ: /novel/update/{idNovel}
      const response = await apiClient.put(`/novel/update/${idNovel}`, novelUpdateData, {
        headers: { 'Content-Type': 'application/json' },
      });
      // Nếu endpoint là /novel/update và idNovel nằm trong novelUpdateData:
      // const response = await apiClient.put('/novel/update', novelUpdateData);

      if (response.data && response.data.code === 1000 && response.data.result) {
        return response.data.result;
      }
      return rejectWithValue(response.data?.message || 'Failed to update novel');
    } catch (error) {
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        return rejectWithValue('Unauthorized or Forbidden. Please login again.');
      }
      return rejectWithValue(error.response?.data?.message || error.message || 'Error updating novel');
    }
  }
);

// API DELETE NOVEL (YÊU CẦU TOKEN)
export const deleteNovel = createAsyncThunk(
  'novels/delete',
  async (idNovel, { rejectWithValue }) => {
    try {
      // Sử dụng apiClient
      const response = await apiClient.delete(`/novel/delete/${idNovel}`); // Giả sử endpoint là /novel/delete/{id}
      if (response.data && response.data.code === 1000) {
        return idNovel; // Trả về id để dễ dàng filter trong reducer
      }
      return rejectWithValue(response.data?.message || `Failed to delete novel with id ${idNovel}`);
    } catch (error) {
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        return rejectWithValue('Unauthorized or Forbidden. Please login again.');
      }
      return rejectWithValue(error.response?.data?.message || error.message || `Error deleting novel with id ${idNovel}`);
    }
  }
);

const initialState = {
  novels: [],
  currentNovel: null,
  loading: false,
  error: null,
};

const novelSlice = createSlice({
  name: 'novels',
  initialState,
  reducers: {
    clearCurrentNovel: (state) => {
      state.currentNovel = null;
      state.error = null;
    },
    // Bạn có thể thêm reducer để set currentNovel từ danh sách novels đã có mà không cần gọi API
    setCurrentNovelFromList: (state, action) => {
      const novelId = action.payload;
      state.currentNovel = state.novels.find(novel => novel.idNovel === novelId) || null;
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
        state.error = action.payload;
      })
      // --- getNovelById ---
      .addCase(getNovelById.pending, (state) => {
        state.loading = true;
        state.error = null;
        // state.currentNovel = null; // Không reset ở đây nếu muốn giữ lại data cũ trong khi load
      })
      .addCase(getNovelById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentNovel = action.payload;
      })
      .addCase(getNovelById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.currentNovel = null;
      })
      // --- createNovel ---
      .addCase(createNovel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNovel.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.idNovel) {
          state.novels.unshift(action.payload); // Thêm vào đầu danh sách
        } else {
          console.warn("Create novel fulfilled but payload is not a valid novel object:", action.payload);
        }
      })
      .addCase(createNovel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // --- updateNovel ---
      .addCase(updateNovel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateNovel.fulfilled, (state, action) => {
        state.loading = false;
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
        state.error = action.payload;
      })
      // --- deleteNovel ---
      .addCase(deleteNovel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteNovel.fulfilled, (state, action) => {
        state.loading = false;
        state.novels = state.novels.filter((novel) => novel.idNovel !== action.payload); // action.payload là idNovel
        if (state.currentNovel && state.currentNovel.idNovel === action.payload) {
          state.currentNovel = null;
        }
      })
      .addCase(deleteNovel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearCurrentNovel, setCurrentNovelFromList } = novelSlice.actions;
export default novelSlice.reducer;