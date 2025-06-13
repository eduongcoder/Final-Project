// src/redux/commentSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import apiClient from '../services/api';

const API_BASE_URL_COMMENT_PUBLIC = "https://truongthaiduongphanthanhvu.onrender.com/comment";

// --- API THUNKS ---

// GET /comment/getAllByChapter/{idChapter}
export const getCommentsByChapter = createAsyncThunk(
  'comments/getByChapter',
  async (idChapter, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL_COMMENT_PUBLIC}/getAllByChapter/${idChapter}`);
      if (response.data && response.data.code === 1000 && Array.isArray(response.data.result)) {
        return response.data.result;
      }
      return rejectWithValue(response.data.message || 'Failed to fetch comments by chapter');
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Error fetching comments');
    }
  }
);

// GET /comment/getAllByNovel/{idNovel}
export const getCommentsByNovel = createAsyncThunk(
  'comments/getByNovel',
  async (idNovel, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL_COMMENT_PUBLIC}/getAllByNovel/${idNovel}`);
      if (response.data && response.data.code === 1000 && Array.isArray(response.data.result)) {
        return response.data.result;
      }
      return rejectWithValue(response.data.message || 'Failed to fetch comments by novel');
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Error fetching comments by novel');
    }
  }
);

// POST /comment/create
export const createComment = createAsyncThunk(
  'comments/create',
  async ({ contentComment, idUser, idChapter }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`/comment/create`, {
        contentComment,
        user: idUser,      // API của bạn yêu cầu 'user' là idUser
        chapter: idChapter // API của bạn yêu cầu 'chapter' là idChapter
      });
      if (response.data && (response.data.code === 200 || response.data.code === 1000) && response.data.result) {
        return response.data.result;
      }
      return rejectWithValue(response.data.message || 'Failed to create comment');
    } catch (error) {
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        return rejectWithValue('Unauthorized. Please login to comment.');
      }
      return rejectWithValue(error.response?.data?.message || error.message || 'Error creating comment');
    }
  }
);

// PUT /comment/update
export const updateCommentContent = createAsyncThunk(
  'comments/updateContent',
  async ({ existingComment, newContent, idUserPerformingUpdate, idChapterOfComment }, { rejectWithValue }) => {
    // existingComment là object comment hiện tại từ state
    // newContent là nội dung mới người dùng nhập
    // idUserPerformingUpdate là ID của người dùng đang thực hiện hành động sửa
    // idChapterOfComment là ID của chapter mà comment này thuộc về (cần cho payload API)
    try {
      if (!existingComment || !existingComment.idComment) {
        return rejectWithValue('Invalid existing comment data for update.');
      }
      if (!idChapterOfComment) {
        // Nếu idChapter không có trong existingComment, nó phải được truyền vào
        // Hoặc bạn có thể cố gắng lấy từ existingComment.chapter.idChapter nếu cấu trúc là vậy
        const chapterId = existingComment.chapter?.idChapter || idChapterOfComment;
        if (!chapterId) {
            return rejectWithValue('Chapter ID is missing for comment update.');
        }
      }


      const payload = {
        idComment: existingComment.idComment,
        contentComment: newContent,
        // Lấy giá trị like/dislike hiện tại từ existingComment, nếu không có thì mặc định là 0
        likeComment: existingComment.likeComment || 0,
        dislikeComment: existingComment.dislikeComment || 0,
        chapter: existingComment.chapter?.idChapter || idChapterOfComment, // API yêu cầu 'chapter' là idChapter (kiểu số)
        user: idUserPerformingUpdate // API yêu cầu 'user' là idUser (kiểu string) của người thực hiện
      };

      const response = await apiClient.put(`/comment/update`, payload);
      if (response.data && (response.data.code === 200 || response.data.code === 1000) && response.data.result) {
        return response.data.result; // API trả về comment đã được cập nhật
      }
      return rejectWithValue(response.data.message || 'Failed to update comment');
    } catch (error) {
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        return rejectWithValue('Unauthorized. Please login to update comment.');
      }
      return rejectWithValue(error.response?.data?.message || error.message || 'Error updating comment');
    }
  }
);

// PUT /comment/updatelike
export const likeComment = createAsyncThunk(
  'comments/like',
  async ({ idComment, idChapter, idUser }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/comment/updatelike`, { idComment, idChapter, idUser });
      if (response.data && (response.data.code === 200 || response.data.code === 1000) && response.data.result) {
        return response.data.result; // API trả về comment đã được cập nhật
      }
      return rejectWithValue(response.data.message || 'Failed to like comment');
    } catch (error) {
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        return rejectWithValue('Unauthorized. Please login to react.');
      }
      return rejectWithValue(error.response?.data?.message || error.message || 'Error liking comment');
    }
  }
);

// PUT /comment/updatedislike
export const dislikeComment = createAsyncThunk(
  'comments/dislike',
  async ({ idComment, idChapter, idUser }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/comment/updatedislike`, { idComment, idChapter, idUser });
      if (response.data && (response.data.code === 200 || response.data.code === 1000) && response.data.result) {
        return response.data.result; // API trả về comment đã được cập nhật
      }
      return rejectWithValue(response.data.message || 'Failed to dislike comment');
    } catch (error) {
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        return rejectWithValue('Unauthorized. Please login to react.');
      }
      return rejectWithValue(error.response?.data?.message || error.message || 'Error disliking comment');
    }
  }
);

// DELETE /comment/{idComment}
export const deleteComment = createAsyncThunk(
  'comments/delete',
  async (idComment, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete(`/comment/${idComment}`);
      if (response.data && (response.data.code === 200 || response.data.code === 1000)) {
        return idComment;
      }
      return rejectWithValue(response.data.message || 'Failed to delete comment');
    } catch (error) {
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        return rejectWithValue('Unauthorized. Please login to delete comment.');
      }
      return rejectWithValue(error.response?.data?.message || error.message || 'Error deleting comment');
    }
  }
);

// GET /comment/getAllByUser/{idUser}
export const getCommentsByUser = createAsyncThunk( /* ... giữ nguyên ... */ );


const initialState = {
  commentsByChapter: [],
  loading: false, // Loading chung cho getByChapter, getByNovel, getByUser
  actionLoading: { // Loading riêng cho các action CUD và like/dislike
    create: false,
    update: false,
    delete: false,
    like: {}, // { [commentId]: boolean }
    dislike: {}, // { [commentId]: boolean }
  },
  error: null,
};

const commentSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    clearComments: (state) => {
      state.commentsByChapter = [];
      state.error = null;
    },
    clearCommentError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    const handlePending = (state) => {
      state.loading = true; // Dùng cho get operations
      state.error = null;
    };
    const handleRejected = (state, action) => {
      state.loading = false; // Dùng cho get operations
      state.error = action.payload || 'An error occurred';
    };

    // Helper function để cập nhật một comment trong mảng
    const updateCommentInList = (state, updatedComment) => {
      if (updatedComment && updatedComment.idComment) {
        const index = state.commentsByChapter.findIndex(comment => comment.idComment === updatedComment.idComment);
        if (index !== -1) {
          state.commentsByChapter[index] = updatedComment;
        }
      }
    };

    builder
      // Get Comments By Chapter
      .addCase(getCommentsByChapter.pending, handlePending)
      .addCase(getCommentsByChapter.fulfilled, (state, action) => {
        state.loading = false;
        state.commentsByChapter = action.payload;
      })
      .addCase(getCommentsByChapter.rejected, handleRejected)

      // Create Comment
      .addCase(createComment.pending, (state) => {
        state.actionLoading.create = true;
        state.error = null;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.actionLoading.create = false;
        if (action.payload && action.payload.idComment) {
          state.commentsByChapter.unshift(action.payload);
        }
      })
      .addCase(createComment.rejected, (state, action) => {
        state.actionLoading.create = false;
        state.error = action.payload || 'Failed to create comment';
      })

      // Update Comment Content
      .addCase(updateCommentContent.pending, (state, action) => {
        state.actionLoading.update = true;
        state.error = null;
      })
      .addCase(updateCommentContent.fulfilled, (state, action) => {
        state.actionLoading.update = false;
        updateCommentInList(state, action.payload);
      })
      .addCase(updateCommentContent.rejected, (state, action) => {
        state.actionLoading.update = false;
        state.error = action.payload || 'Failed to update comment';
      })

      // Like Comment
      .addCase(likeComment.pending, (state, action) => {
        state.actionLoading.like[action.meta.arg.idComment] = true;
        state.error = null;
      })
      .addCase(likeComment.fulfilled, (state, action) => {
        state.actionLoading.like[action.meta.arg.idComment] = false;
        updateCommentInList(state, action.payload);
      })
      .addCase(likeComment.rejected, (state, action) => {
        state.actionLoading.like[action.meta.arg.idComment] = false;
        state.error = action.payload || 'Failed to like comment';
      })

      // Dislike Comment
      .addCase(dislikeComment.pending, (state, action) => {
        state.actionLoading.dislike[action.meta.arg.idComment] = true;
        state.error = null;
      })
      .addCase(dislikeComment.fulfilled, (state, action) => {
        state.actionLoading.dislike[action.meta.arg.idComment] = false;
        updateCommentInList(state, action.payload);
      })
      .addCase(dislikeComment.rejected, (state, action) => {
        state.actionLoading.dislike[action.meta.arg.idComment] = false;
        state.error = action.payload || 'Failed to dislike comment';
      })

      // Delete Comment
      .addCase(deleteComment.pending, (state, action) => {
        state.actionLoading.delete = true;
        state.error = null;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.actionLoading.delete = false;
        state.commentsByChapter = state.commentsByChapter.filter(comment => comment.idComment !== action.payload);
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.actionLoading.delete = false;
        state.error = action.payload || 'Failed to delete comment';
      });

      // Loại bỏ các addMatcher nếu đã xử lý riêng lẻ từng action
      // Nếu bạn vẫn muốn dùng addMatcher, đảm bảo nó không xung đột với các .addCase ở trên.
      // Hiện tại, tôi đã chuyển logic cập nhật vào từng .fulfilled của like, dislike, updateContent.
  },
});

export const { clearComments, clearCommentError } = commentSlice.actions;
export default commentSlice.reducer;