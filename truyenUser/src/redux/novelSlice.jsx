// src/redux/novelSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios'; // Dùng cho các API public không cần token
import apiClient from '../services/api'; // Dùng cho các API cần token (đã cấu hình interceptor)

// Base URL cho các API public liên quan đến novel
const publicApiBaseNovel = "https://truongthaiduongphanthanhvu.onrender.com/novel";
// Base URL tương đối cho các API cần token (sẽ được ghép với baseURL của apiClient)
const protectedApiBaseNovel = "/novel"; // Ví dụ: /novel/create, /novel/update/:id

// --- API THUNKS ---

// 1. Lấy tất cả truyện (API Public - không cần token)
export const getAllNovels = createAsyncThunk(
  'novels/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${publicApiBaseNovel}/getAll`);
      if (response.data && response.data.code === 1000 && Array.isArray(response.data.result)) {
        // Dữ liệu response.data.result đã chứa mảng các novel,
        // mỗi novel object có trường "authors" là một mảng các object tác giả.
        return response.data.result;
      }
      return rejectWithValue(response.data?.message || 'Không thể tải danh sách truyện.');
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Lỗi khi tải danh sách truyện.');
    }
  }
);

// 2. Lấy truyện theo ID (API Public - không cần token)
export const getNovelById = createAsyncThunk(
  'novels/getById',
  async (idNovel, { rejectWithValue }) => {
    try {
      // Giả sử endpoint là /novel/{idNovel}
      const response = await axios.get(`${publicApiBaseNovel}/${idNovel}`);
      if (response.data && response.data.code === 1000 && response.data.result) {
        // Dữ liệu response.data.result là một novel object,
        // đã bao gồm trường "authors" là một mảng các object tác giả.
        return response.data.result;
      }
      return rejectWithValue(response.data?.message || `Không thể tải truyện với ID ${idNovel}.`);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || `Lỗi khi tải truyện với ID ${idNovel}.`);
    }
  }
);

// 3. Tạo truyện mới (API cần token)
export const createNovel = createAsyncThunk(
  'novels/create',
  async (novelData, { rejectWithValue }) => {
    try {
      // novelData nên bao gồm các trường cần thiết, ví dụ: nameNovel, descriptionNovel,
      // và có thể là một mảng các idAuthor nếu backend yêu cầu như vậy để liên kết tác giả.
      // Hoặc backend có thể xử lý việc này thông qua một trường khác.
      const response = await apiClient.post(`${protectedApiBaseNovel}/create`, novelData, {
        headers: { 'Content-Type': 'application/json' }, // Đảm bảo content type nếu backend yêu cầu
      });
      if (response.data && response.data.code === 1000 && response.data.result) {
        // Giả sử backend trả về novel object mới đã tạo, bao gồm cả thông tin authors nếu có.
        return response.data.result;
      }
      return rejectWithValue(response.data?.message || 'Không thể tạo truyện mới.');
    } catch (error) {
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        return rejectWithValue('Không có quyền truy cập hoặc phiên đăng nhập hết hạn.');
      }
      return rejectWithValue(error.response?.data?.message || error.message || 'Lỗi khi tạo truyện mới.');
    }
  }
);

// 4. Cập nhật truyện (API cần token)
export const updateNovel = createAsyncThunk(
  'novels/update',
  async ({ idNovel, novelUpdateData }, { rejectWithValue }) => {
    try {
      // novelUpdateData nên chứa các trường cần cập nhật.
      const response = await apiClient.put(`${protectedApiBaseNovel}/update/${idNovel}`, novelUpdateData, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.data && response.data.code === 1000 && response.data.result) {
        // Giả sử backend trả về novel object đã cập nhật, bao gồm cả thông tin authors.
        return response.data.result;
      }
      return rejectWithValue(response.data?.message || 'Không thể cập nhật truyện.');
    } catch (error) {
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        return rejectWithValue('Không có quyền truy cập hoặc phiên đăng nhập hết hạn.');
      }
      return rejectWithValue(error.response?.data?.message || error.message || 'Lỗi khi cập nhật truyện.');
    }
  }
);

// 5. Xóa truyện (API cần token)
export const deleteNovel = createAsyncThunk(
  'novels/delete',
  async (idNovel, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete(`${protectedApiBaseNovel}/delete/${idNovel}`);
      if (response.data && response.data.code === 1000) {
        return idNovel; // Trả về idNovel để reducer có thể xóa nó khỏi state
      }
      return rejectWithValue(response.data?.message || `Không thể xóa truyện với ID ${idNovel}.`);
    } catch (error) {
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        return rejectWithValue('Không có quyền truy cập hoặc phiên đăng nhập hết hạn.');
      }
      return rejectWithValue(error.response?.data?.message || error.message || `Lỗi khi xóa truyện với ID ${idNovel}.`);
    }
  }
);

// --- SLICE DEFINITION ---
const initialState = {
  novels: [],          // Danh sách tất cả truyện, mỗi truyện có thể chứa mảng authors
  currentNovel: null,  // Truyện đang được xem chi tiết, cũng chứa mảng authors
  loading: false,
  error: null,
};

const novelSlice = createSlice({
  name: 'novels',
  initialState,
  reducers: {
    // Xóa truyện hiện tại đang xem (ví dụ: khi rời khỏi trang chi tiết)
    clearCurrentNovel: (state) => {
      state.currentNovel = null;
      state.error = null; // Cũng có thể xóa lỗi liên quan đến currentNovel
    },
    // Reducer này hữu ích nếu bạn muốn set currentNovel từ danh sách đã có mà không cần gọi API lại
    // Ví dụ: khi click vào một truyện từ danh sách đã fetch bằng getAllNovels
    setCurrentNovelFromList: (state, action) => {
      const novelIdToSet = action.payload;
      state.currentNovel = state.novels.find(novel => novel.idNovel === novelIdToSet) || null;
      state.error = null; // Xóa lỗi nếu có khi set truyện mới
    }
  },
  extraReducers: (builder) => {
    builder
      // getAllNovels
      .addCase(getAllNovels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllNovels.fulfilled, (state, action) => {
        state.loading = false;
        state.novels = action.payload; // payload đã bao gồm authors cho mỗi novel
      })
      .addCase(getAllNovels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.novels = []; // Có thể reset về rỗng nếu lỗi
      })

      // getNovelById
      .addCase(getNovelById.pending, (state) => {
        state.loading = true;
        state.error = null;
        // Không nên reset currentNovel ở đây để UI không bị nhấp nháy nếu đang hiển thị truyện cũ
      })
      .addCase(getNovelById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentNovel = action.payload; // payload đã bao gồm authors
      })
      .addCase(getNovelById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.currentNovel = null; // Reset nếu lỗi
      })

      // createNovel
      .addCase(createNovel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNovel.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.idNovel) {
          // Thêm truyện mới vào đầu danh sách (hoặc cuối, tùy theo yêu cầu hiển thị)
          state.novels.unshift(action.payload); // action.payload là novel object mới, đã có authors
        } else {
          console.warn("Create novel fulfilled nhưng payload không hợp lệ:", action.payload);
        }
      })
      .addCase(createNovel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // updateNovel
      .addCase(updateNovel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateNovel.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.idNovel) {
          const updatedNovel = action.payload; // action.payload là novel object đã cập nhật, có authors
          // Cập nhật trong danh sách novels
          const index = state.novels.findIndex((novel) => novel.idNovel === updatedNovel.idNovel);
          if (index !== -1) {
            state.novels[index] = updatedNovel;
          }
          // Cập nhật currentNovel nếu nó đang được hiển thị
          if (state.currentNovel && state.currentNovel.idNovel === updatedNovel.idNovel) {
            state.currentNovel = updatedNovel;
          }
        } else {
          console.warn("Update novel fulfilled nhưng payload không hợp lệ:", action.payload);
        }
      })
      .addCase(updateNovel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // deleteNovel
      .addCase(deleteNovel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteNovel.fulfilled, (state, action) => {
        state.loading = false;
        const deletedNovelId = action.payload; // action.payload là idNovel đã xóa
        state.novels = state.novels.filter((novel) => novel.idNovel !== deletedNovelId);
        if (state.currentNovel && state.currentNovel.idNovel === deletedNovelId) {
          state.currentNovel = null; // Xóa currentNovel nếu nó là truyện vừa bị xóa
        }
      })
      .addCase(deleteNovel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearCurrentNovel, setCurrentNovelFromList } = novelSlice.actions;

// Selectors (tùy chọn, có thể không cần thay đổi nhiều)
export const selectAllNovels = (state) => state.novels.novels;
export const selectCurrentNovel = (state) => state.novels.currentNovel;
export const selectNovelsLoading = (state) => state.novels.loading;
export const selectNovelsError = (state) => state.novels.error;

export default novelSlice.reducer;