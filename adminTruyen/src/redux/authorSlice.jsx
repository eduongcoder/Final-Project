import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios'; // Bỏ axios gốc
import apiClient from '../services/api'; // Dùng apiClient

const apiPath = "/author"; // Đường dẫn tương đối

// --- ASYNC THUNKS ---

// Lấy tất cả tác giả (public, không cần token)
export const getAllAuthors = createAsyncThunk(
  'authors/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`${apiPath}/getAll`);
      return response.data.result;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Tạo tác giả mới (CẦN TOKEN, dùng FormData)
export const createAuthor = createAsyncThunk(
  'authors/create',
  async (authorFormData, { rejectWithValue }) => {
    try {
      // Giả định authorFormData đã là một object FormData được tạo từ component
      // Ví dụ:
      // const formData = new FormData();
      // formData.append('nameAuthor', 'Tên tác giả');
      // formData.append('image', fileObject);
      // dispatch(createAuthor(formData));

      const response = await apiClient.post(`${apiPath}/create`, authorFormData);
      return response.data.result;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Cập nhật tác giả (CẦN TOKEN, dùng FormData)
export const updateAuthor = createAsyncThunk(
  'authors/update',
  async (authorFormData, { rejectWithValue }) => {
    try {
      // Tương tự như create, giả định authorFormData là một object FormData
      const response = await apiClient.put(`${apiPath}/update`, authorFormData);
      return response.data.result;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Xóa tác giả (CẦN TOKEN)
export const deleteAuthor = createAsyncThunk(
  'authors/delete',
  async (idAuthor, { rejectWithValue }) => {
    try {
      await apiClient.delete(`${apiPath}/${idAuthor}`);
      // Trả về id đã xóa để reducer xử lý
      return idAuthor;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);


// --- SLICE DEFINITION ---

const authorSlice = createSlice({
  name: 'authors',
  initialState: {
    authors: [],
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
      state.error = action.payload;
    };

    builder
      // GET ALL
      .addCase(getAllAuthors.pending, handlePending)
      .addCase(getAllAuthors.fulfilled, (state, action) => {
        state.loading = false;
        state.authors = action.payload || [];
      })
      .addCase(getAllAuthors.rejected, handleRejected)

      // CREATE
      .addCase(createAuthor.pending, handlePending)
      .addCase(createAuthor.fulfilled, (state, action) => {
        state.loading = false;
        state.authors.push(action.payload);
      })
      .addCase(createAuthor.rejected, handleRejected)

      // UPDATE
      .addCase(updateAuthor.pending, handlePending)
      .addCase(updateAuthor.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.authors.findIndex((author) => author.idAuthor === action.payload.idAuthor);
        if (index !== -1) {
          state.authors[index] = action.payload;
        }
      })
      .addCase(updateAuthor.rejected, handleRejected)

      // DELETE
      .addCase(deleteAuthor.pending, handlePending)
      .addCase(deleteAuthor.fulfilled, (state, action) => {
        state.loading = false;
        // action.payload bây giờ là idAuthor đã xóa
        state.authors = state.authors.filter((author) => author.idAuthor !== action.payload);
      })
      .addCase(deleteAuthor.rejected, handleRejected);
  }
});

export default authorSlice.reducer;