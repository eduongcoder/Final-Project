import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios'; // Không dùng axios gốc nữa
import apiClient from '../services/api'; // Sử dụng apiClient đã cấu hình

const apiPath = "/category"; // Đường dẫn tương đối

// --- ASYNC THUNKS ---

// Lấy tất cả category (thường là public, không cần token)
export const getAllCategories = createAsyncThunk(
  'categories/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`${apiPath}/getAll`);
      return response.data.result;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Tạo category mới (CẦN TOKEN)
export const createCategory = createAsyncThunk(
  'categories/create',
  async (categoryData, { rejectWithValue }) => {
    try {
      // apiClient sẽ tự động thêm token
      const response = await apiClient.post(`${apiPath}/create`, categoryData);
      return response.data.result;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Cập nhật category (CẦN TOKEN)
export const updateCategory = createAsyncThunk(
  'categories/update',
  async (categoryData, { rejectWithValue }) => {
    try {
      // apiClient sẽ tự động thêm token
      const response = await apiClient.put(`${apiPath}/update`, categoryData);
      return response.data.result;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Xóa category (CẦN TOKEN)
export const deleteCategory = createAsyncThunk(
  'categories/delete',
  async (idCategory, { rejectWithValue }) => {
    try {
      // API của bạn có thể là /delete/{id} hoặc chỉ là /{id} với phương thức DELETE
      // Hãy kiểm tra lại endpoint này với backend
      // Cách 1: Nếu endpoint là /delete/{id}
      // await apiClient.delete(`${apiPath}/delete/${idCategory}`);

      // Cách 2: (Phổ biến hơn) Nếu endpoint là /{id}
      await apiClient.delete(`${apiPath}/${idCategory}`);

      // Trả về id đã xóa để reducer xử lý
      return idCategory;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// --- SLICE DEFINITION ---

const categorySlice = createSlice({
  name: 'categories',
  initialState: {
    categories: [],
    loading: false,
    error: null
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
      .addCase(getAllCategories.pending, handlePending)
      .addCase(getAllCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload || [];
      })
      .addCase(getAllCategories.rejected, handleRejected)

      // CREATE
      .addCase(createCategory.pending, handlePending)
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories.push(action.payload);
      })
      .addCase(createCategory.rejected, handleRejected)

      // UPDATE
      .addCase(updateCategory.pending, handlePending)
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading = false;
        // Đảm bảo dùng đúng key ID, ví dụ: 'idCategory'
        const index = state.categories.findIndex((cat) => cat.idCategory === action.payload.idCategory);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })
      .addCase(updateCategory.rejected, handleRejected)

      // DELETE
      .addCase(deleteCategory.pending, handlePending)
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading = false;
        // action.payload bây giờ là idCategory đã xóa
        state.categories = state.categories.filter((cat) => cat.idCategory !== action.payload);
      })
      .addCase(deleteCategory.rejected, handleRejected);
  }
});

export default categorySlice.reducer;