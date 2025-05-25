// src/redux/commentSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL_COMMENT = "https://truongthaiduongphanthanhvu.onrender.com/comment";

// Async Thunks for Comments

// GET /comment/getAllByChapter/{idChapter}
export const getCommentsByChapter = createAsyncThunk(
  'comments/getByChapter',
  async (idChapter, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL_COMMENT}/getAllByChapter/${idChapter}`);
      if (response.data && response.data.code === 1000 && Array.isArray(response.data.result)) {
        // Sắp xếp comment, ví dụ: mới nhất lên đầu (nếu có trường timestamp)
        // Hoặc giữ nguyên thứ tự từ API nếu API đã sắp xếp
        return response.data.result;
      } else {
        return rejectWithValue(response.data.message || 'Failed to fetch comments by chapter');
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Error fetching comments');
    }
  }
);

// POST /comment/create
// body: { "contentComment": "string", "user": "string" (idUser), "chapter": "string" (idChapter) }
export const createComment = createAsyncThunk(
  'comments/create',
  async ({ contentComment, idUser, idChapter }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL_COMMENT}/create`, {
        contentComment,
        user: idUser,     // API của bạn dùng "user" và "chapter"
        chapter: idChapter
      });
      if (response.data && response.data.code === 200 && response.data.result) {
        return response.data.result; // Trả về comment mới được tạo
      } else {
        return rejectWithValue(response.data.message || 'Failed to create comment');
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Error creating comment');
    }
  }
);

// PUT /comment/update
// body: { "idComment": "string", "contentComment": "string", "likeComment": number, "dislikeComment": number, "idChapter": "string", "user": "string" }
// API update của bạn khá phức tạp, có vẻ nó cho phép cập nhật cả like/dislike.
// Để đơn giản, thunk này chỉ tập trung vào cập nhật contentComment.
// Like/Dislike sẽ có thunk riêng.
export const updateCommentContent = createAsyncThunk(
  'comments/updateContent',
  async ({ idComment, contentComment, idChapter, idUser }, { rejectWithValue }) => {
    try {
      // API yêu cầu tất cả các trường, kể cả like/dislike hiện tại nếu không muốn thay đổi chúng
      // Cần lấy comment hiện tại để biết like/dislike hoặc API backend cần linh hoạt hơn
      // Giả sử chỉ cập nhật content, API backend nên bỏ qua like/dislike nếu không được gửi
      const response = await axios.put(`${API_BASE_URL_COMMENT}/update`, {
        idComment,
        contentComment,
        // Các trường khác có thể cần lấy từ comment hiện tại hoặc API phải cho phép partial update
        idChapter: idChapter, // Cần idChapter
        user: idUser,         // Cần idUser
        // likeComment: currentLike, // Cần logic để lấy giá trị này
        // dislikeComment: currentDislike, // Cần logic để lấy giá trị này
      });
       if (response.data && response.data.code === 200 && response.data.result) {
        return response.data.result;
      } else {
        return rejectWithValue(response.data.message || 'Failed to update comment');
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Error updating comment');
    }
  }
);

// PUT /comment/updatelike
// body: { "idComment": number, "idChapter": number, "idUser": "string" }
export const likeComment = createAsyncThunk(
  'comments/like',
  async ({ idComment, idChapter, idUser }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_BASE_URL_COMMENT}/updatelike`, { idComment, idChapter, idUser });
      if (response.data && response.data.code === 200 && response.data.result) {
        return response.data.result; // Trả về comment đã được cập nhật like
      } else {
        return rejectWithValue(response.data.message || 'Failed to like comment');
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Error liking comment');
    }
  }
);

// PUT /comment/updatedislike
// body: { "idComment": number, "idChapter": number, "idUser": "string" }
export const dislikeComment = createAsyncThunk(
  'comments/dislike',
  async ({ idComment, idChapter, idUser }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_BASE_URL_COMMENT}/updatedislike`, { idComment, idChapter, idUser });
      if (response.data && response.data.code === 200 && response.data.result) {
        return response.data.result; // Trả về comment đã được cập nhật dislike
      } else {
        return rejectWithValue(response.data.message || 'Failed to dislike comment');
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Error disliking comment');
    }
  }
);


// DELETE /comment/{idComment}
export const deleteComment = createAsyncThunk(
  'comments/delete',
  async (idComment, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_BASE_URL_COMMENT}/${idComment}`);
      if (response.data && response.data.code === 200) {
        return idComment; // Trả về ID của comment đã xóa để cập nhật state
      } else {
        return rejectWithValue(response.data.message || 'Failed to delete comment');
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Error deleting comment');
    }
  }
);

// GET /comment/getAllByUser/{idUser} - (Không dùng trực tiếp trong component này nhưng có thể hữu ích)
export const getCommentsByUser = createAsyncThunk(
  'comments/getByUser',
  async (idUser, { rejectWithValue }) => { /* ... */ }
);

// GET /comment/getAllByNovel/{idNovel} - (Không dùng trực tiếp trong component này)
export const getCommentsByNovel = createAsyncThunk(
  'comments/getByNovel',
  async (idNovel, { rejectWithValue }) => { /* ... */ }
);


const commentSlice = createSlice({
  name: 'comments',
  initialState: {
    commentsByChapter: [],
    loading: false,
    error: null,
  },
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
      state.loading = true;
      state.error = null;
    };
    const handleRejected = (state, action) => {
      state.loading = false;
      state.error = action.payload || 'An error occurred';
    };

    // === TẤT CẢ addCase PHẢI ĐƯỢC ĐẶT Ở ĐÂY, TRƯỚC addMatcher ===

    // Get Comments By Chapter
    builder
      .addCase(getCommentsByChapter.pending, handlePending)
      .addCase(getCommentsByChapter.fulfilled, (state, action) => {
        state.loading = false;
        state.commentsByChapter = action.payload;
      })
      .addCase(getCommentsByChapter.rejected, handleRejected)

      // Create Comment
      .addCase(createComment.pending, handlePending)
      .addCase(createComment.fulfilled, (state, action) => {
        state.loading = false;
        state.commentsByChapter.unshift(action.payload);
      })
      .addCase(createComment.rejected, handleRejected)

      // Delete Comment (DI CHUYỂN LÊN TRÊN)
      .addCase(deleteComment.pending, handlePending)
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.loading = false;
        state.commentsByChapter = state.commentsByChapter.filter(comment => comment.idComment !== action.payload);
      })
      .addCase(deleteComment.rejected, handleRejected);

    // === TẤT CẢ addMatcher PHẢI ĐƯỢC ĐẶT Ở ĐÂY, SAU addCase ===

    // Xử lý pending cho các action update (updateContent, like, dislike)
    builder.addMatcher(
        (action) => [updateCommentContent.pending.type, likeComment.pending.type, dislikeComment.pending.type].includes(action.type),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      // Xử lý fulfilled cho các action update
      .addMatcher(
        (action) => [updateCommentContent.fulfilled.type, likeComment.fulfilled.type, dislikeComment.fulfilled.type].includes(action.type),
        (state, action) => {
          state.loading = false;
          const index = state.commentsByChapter.findIndex(comment => comment.idComment === action.payload.idComment);
          if (index !== -1) {
            state.commentsByChapter[index] = action.payload;
          }
        }
      )
      // Xử lý rejected cho các action update
      .addMatcher(
        (action) => [updateCommentContent.rejected.type, likeComment.rejected.type, dislikeComment.rejected.type].includes(action.type),
        (state, action) => {
          state.loading = false;
          state.error = action.payload || 'Comment update/reaction failed';
        }
      );
  },
});

export const { clearComments, clearCommentError } = commentSlice.actions;
export default commentSlice.reducer;