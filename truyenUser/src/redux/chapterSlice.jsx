// src/redux/chapterSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const apiBase = "https://truongthaiduongphanthanhvu.onrender.com/chapter";

export const getAllChapters = createAsyncThunk('chapter/getAll', async (idNovel) => {
  const response = await axios.get(`${apiBase}/getAll/${idNovel}`);
  return response.data.result;
});

export const getChapterById = createAsyncThunk('chapter/getById', async (idChapter) => {
  const response = await axios.get(`${apiBase}/${idChapter}`);
  return response.data.result;
});

export const createChapter = createAsyncThunk('chapter/create', async ({ request, textFile }) => {
  const formData = new FormData();
  formData.append('request', new Blob([JSON.stringify(request)], { type: 'application/json' }));
  if (textFile) {
    formData.append('textFile', textFile);
  }

  const response = await axios.post(`${apiBase}/create`, formData);
  return response.data.result;
});

export const updateChapter = createAsyncThunk('chapter/update', async ({ request, textFile }) => {
  const formData = new FormData();
  formData.append('request', new Blob([JSON.stringify(request)], { type: 'application/json' }));
  if (textFile) {
    formData.append('textFile', textFile);
  }

  const response = await axios.put(`${apiBase}/update`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data.result;
});

export const deleteChapter = createAsyncThunk('chapter/delete', async (idChapter) => {
  const response = await axios.delete(`${apiBase}/${idChapter}`);
  return response.data.result; // should be the deleted chapter ID
});

const chapterSlice = createSlice({
  name: 'chapters',
  initialState: {
    chapters: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllChapters.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllChapters.fulfilled, (state, action) => {
        state.loading = false;
        state.chapters = action.payload;
      })
      .addCase(getAllChapters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(getChapterById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getChapterById.fulfilled, (state, action) => {
        state.loading = false;
        state.chapters = [action.payload];
      })
      .addCase(getChapterById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(createChapter.pending, (state) => {
        state.loading = true;
      })
      .addCase(createChapter.fulfilled, (state, action) => {
        state.loading = false;
        state.chapters.push(action.payload);
      })
      .addCase(createChapter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(updateChapter.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateChapter.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.chapters.findIndex((ch) => ch.idChapter === action.payload.idChapter);
        if (index !== -1) {
          state.chapters[index] = action.payload;
        }
      })
      .addCase(updateChapter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(deleteChapter.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteChapter.fulfilled, (state, action) => {
        state.loading = false;
        state.chapters = state.chapters.filter((ch) => ch.idChapter !== action.payload);
      })
      .addCase(deleteChapter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export default chapterSlice.reducer;
