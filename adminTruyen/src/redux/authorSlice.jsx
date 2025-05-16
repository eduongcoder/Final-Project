// src/redux/authorSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const apiBase = "https://truongthaiduongphanthanhvu.onrender.com/author";

// API requests cho Author
export const getAllAuthors = createAsyncThunk('authors/getAll', async () => {
  const response = await axios.get(`${apiBase}/getAll`);
  return response.data.result; 
});

export const createAuthor = createAsyncThunk('authors/create', async (data) => {
  const response = await axios.post(`${apiBase}/create`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
  return response.data.result;
});

export const updateAuthor = createAsyncThunk('authors/update', async (data) => {
  const response = await axios.put(`${apiBase}/update`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
  return response.data.result;
});

export const deleteAuthor = createAsyncThunk('authors/delete', async (id) => {
  const response = await axios.delete(`${apiBase}/${id}`);
  console.log(response.data.result);
  return response.data.result;
});

const authorSlice = createSlice({
  name: 'authors',
  initialState: {
    authors: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllAuthors.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllAuthors.fulfilled, (state, action) => {
        state.loading = false;
        state.authors = action.payload;
      })
      .addCase(getAllAuthors.rejected, (state, action) => {
        state.loading = false;
        //state.authors = Array.isArray(action.payload) ? action.payload : []; // Kiểm tra dữ liệu trả về

        state.error = action.error.message;
      })
      .addCase(createAuthor.pending, (state) => {
        state.loading = true;
      })
      .addCase(createAuthor.fulfilled, (state, action) => {
        state.loading = false;
        state.authors.push(action.payload); // thêm author mới vào mảng cũ
      })
      .addCase(createAuthor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateAuthor.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateAuthor.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.authors.findIndex((author) => author.idAuthor === action.payload.idAuthor);
        if (index !== -1) {
          state.authors[index] = action.payload;
        }
      })
      .addCase(updateAuthor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteAuthor.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteAuthor.fulfilled, (state, action) => {
        state.loading = false;
        console.log("ID cần xóa:", action.payload);
        console.log("Tất cả ID hiện tại:", state.authors.map(a => a.idAuthor));
        state.authors = state.authors.filter((author) => author.idAuthor !== action.payload);
      })
      .addCase(deleteAuthor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export default authorSlice.reducer;
