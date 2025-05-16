// src/redux/novelSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Các API requests cho Novel
const apiBase = "https://truongthaiduongphanthanhvu.onrender.com/novel";

export const getAllNovels = createAsyncThunk('novels/getAll', async () => {
  const response = await axios.get(`${apiBase}/getAll`);
  return response.data.result;
});

export const getNovelById = createAsyncThunk('novels/getById', async (id) => {
  const response = await axios.get(`${apiBase}/${id}`);
  return response.data;
});

export const createNovel = createAsyncThunk('novels/create', async (data) => {
  const response = await axios.post(`${apiBase}/create`, data);  
  return response.data.result;
});

export const updateNovel = createAsyncThunk('novels/update', async (data) => {
  const response = await axios.put(`${apiBase}/update`, data);
  return response.data.result;
});

export const deleteNovel = createAsyncThunk('novels/delete', async (id) => {
  const response = await axios.delete(`${apiBase}/${id}`);
  return response.data.result;
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
      .addCase(getAllNovels.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllNovels.fulfilled, (state, action) => {
        state.loading = false;
        state.novels = action.payload;
      })
      .addCase(getAllNovels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getNovelById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getNovelById.fulfilled, (state, action) => {
        state.loading = false;
        state.novels = [action.payload];
      })
      .addCase(getNovelById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createNovel.pending, (state) => {
        state.loading = true;
      })
      .addCase(createNovel.fulfilled, (state, action) => {
        state.loading = false;
        console.log("Novel created successfully:", action.payload);
        state.novels.push(action.payload);
      })
      .addCase(createNovel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateNovel.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateNovel.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.novels.findIndex((novel) => novel.idNovel === action.payload.idNovel);
        if (index !== -1) {
          state.novels[index] = action.payload;
        }
      })
      .addCase(updateNovel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteNovel.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteNovel.fulfilled, (state, action) => {
        state.loading = false;
        state.novels = state.novels.filter((novel) => novel.idNovel !== action.payload);
      })
      .addCase(deleteNovel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export default novelSlice.reducer;
