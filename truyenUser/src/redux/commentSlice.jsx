// src/redux/commentSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios'; // axios gốc cho API public
import apiClient from '../services/api'; // apiClient cho API cần xác thực

const API_BASE_URL_COMMENT_PUBLIC = "https://truongthaiduongphanthanhvu.onrender.com/comment"; // Cho API public
// API_BASE_URL cho apiClient đã được định nghĩa trong apiClient (src/services/api.js)

// GET /comment/getAllByChapter/{idChapter} (Whitelist - Public)
export const getCommentsByChapter = createAsyncThunk(
  'comments/getByChapter',
  async (idChapter, { rejectWithValue }) => {
    try {
      // Sử dụng axios gốc vì đây là API public
      const response = await axios.get(`${API_BASE_URL_COMMENT_PUBLIC}/getAllByChapter/${idChapter}`);
      if (response.data && response.data.code === 1000 && Array.isArray(response.data.result)) {
        return response.data.result;
      } else {
        return rejectWithValue(response.data.message || 'Failed to fetch comments by chapter');
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Error fetching comments');
    }
  }
);

// GET /comment/getAllByNovel/{idNovel} (Whitelist - Public)
export const getCommentsByNovel = createAsyncThunk(
  'comments/getByNovel',
  async (idNovel, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL_COMMENT_PUBLIC}/getAllByNovel/${idNovel}`);
      if (response.data && response.data.code === 1000 && Array.isArray(response.data.result)) {
        return response.data.result;
      } else {
        return rejectWithValue(response.data.message || 'Failed to fetch comments by novel');
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Error fetching comments by novel');
    }
  }
);


// POST /comment/create (Cần Token)
export const createComment = createAsyncThunk(
  'comments/create',
  async ({ contentComment, idUser, idChapter }, { rejectWithValue }) => {
    try {
      // Sử dụng apiClient để tự động gửi token
      const response = await apiClient.post(`/comment/create`, { // Đường dẫn tương đối
        contentComment,
        user: idUser,
        chapter: idChapter
      });
      // Giả sử backend trả về code 200 hoặc 1000 cho create thành công
      if (response.data && (response.data.code === 200 || response.data.code === 1000) && response.data.result) {
        return response.data.result;
      } else {
        return rejectWithValue(response.data.message || 'Failed to create comment');
      }
    } catch (error) {
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        return rejectWithValue('Unauthorized. Please login to comment.');
      }
      return rejectWithValue(error.response?.data?.message || error.message || 'Error creating comment');
    }
  }
);

// PUT /comment/update (Cần Token)
export const updateCommentContent = createAsyncThunk(
  'comments/updateContent',
  async ({ idComment, contentComment, idChapter, idUser /*, likeComment, dislikeComment */ }, { rejectWithValue }) => {
    try {
      // API backend của bạn yêu cầu gửi tất cả các trường.
      // Nếu bạn chỉ muốn cập nhật contentComment, bạn cần đảm bảo các trường khác
      // được gửi với giá trị hiện tại của chúng, hoặc backend cho phép partial update.
      // Để đơn giản, ví dụ này chỉ gửi những gì cần thiết cho việc cập nhật content.
      // Bạn cần điều chỉnh payload dựa trên yêu cầu thực tế của API update.
      const payload = {
        idComment,
        contentComment,
        idChapter, // API yêu cầu
        user: idUser, // API yêu cầu
        // likeComment, // Gửi nếu bạn có giá trị hiện tại
        // dislikeComment, // Gửi nếu bạn có giá trị hiện tại
      };
      const response = await apiClient.put(`/comment/update`, payload); // Đường dẫn tương đối
      if (response.data && (response.data.code === 200 || response.data.code === 1000) && response.data.result) {
        return response.data.result;
      } else {
        return rejectWithValue(response.data.message || 'Failed to update comment');
      }
    } catch (error) {
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        return rejectWithValue('Unauthorized. Please login to update comment.');
      }
      return rejectWithValue(error.response?.data?.message || error.message || 'Error updating comment');
    }
  }
);

// PUT /comment/updatelike (Cần Token)
export const likeComment = createAsyncThunk(
  'comments/like',
  async ({ idComment, idChapter, idUser }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/comment/updatelike`, { idComment, idChapter, idUser });
      if (response.data && (response.data.code === 200 || response.data.code === 1000) && response.data.result) {
        return response.data.result;
      } else {
        return rejectWithValue(response.data.message || 'Failed to like comment');
      }
    } catch (error) {
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        return rejectWithValue('Unauthorized. Please login to react.');
      }
      return rejectWithValue(error.response?.data?.message || error.message || 'Error liking comment');
    }
  }
);

// PUT /comment/updatedislike (Cần Token)
export const dislikeComment = createAsyncThunk(
  'comments/dislike',
  async ({ idComment, idChapter, idUser }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/comment/updatedislike`, { idComment, idChapter, idUser });
      if (response.data && (response.data.code === 200 || response.data.code === 1000) && response.data.result) {
        return response.data.result;
      } else {
        return rejectWithValue(response.data.message || 'Failed to dislike comment');
      }
    } catch (error) {
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        return rejectWithValue('Unauthorized. Please login to react.');
      }
      return rejectWithValue(error.response?.data?.message || error.message || 'Error disliking comment');
    }
  }
);

// DELETE /comment/{idComment} (Cần Token)
export const deleteComment = createAsyncThunk(
  'comments/delete',
  async (idComment, { rejectWithValue }) => {
    try {
      // Giả sử endpoint là /comment/delete/{idComment} hoặc chỉ /comment/{idComment}
      const response = await apiClient.delete(`/comment/${idComment}`);
      // Hoặc nếu endpoint là /comment/delete và idComment trong body (ít phổ biến cho DELETE)
      // const response = await apiClient.delete(`/comment/delete`, { data: { idComment } });

      if (response.data && (response.data.code === 200 || response.data.code === 1000)) {
        return idComment; // Trả về ID để cập nhật state
      } else {
        return rejectWithValue(response.data.message || 'Failed to delete comment');
      }
    } catch (error) {
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        return rejectWithValue('Unauthorized. Please login to delete comment.');
      }
      return rejectWithValue(error.response?.data?.message || error.message || 'Error deleting comment');
    }
  }
);

// GET /comment/getAllByUser/{idUser} (Có thể cần token hoặc không, tùy vào logic của bạn)
// Nếu cần token (ví dụ chỉ user đó mới xem được comment của mình):
export const getCommentsByUser = createAsyncThunk(
  'comments/getByUser',
  async (idUser, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/comment/getAllByUser/${idUser}`);
      if (response.data && response.data.code === 1000 && Array.isArray(response.data.result)) {
        return response.data.result;
      } else {
        return rejectWithValue(response.data.message || 'Failed to fetch user comments');
      }
    } catch (error) {
       if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        return rejectWithValue('Unauthorized.');
      }
      return rejectWithValue(error.response?.data?.message || error.message || 'Error fetching user comments');
    }
  }
);


const initialState = {
  commentsByChapter: [], // Lưu trữ comment cho chương hiện tại đang xem
  // commentsByNovel: [], // Nếu bạn muốn lưu trữ tất cả comment của một truyện
  // userComments: [], // Nếu bạn muốn lưu trữ comment của một user cụ thể
  loading: false,
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
    // Bạn có thể thêm reducer để cập nhật comment ngay lập tức sau khi like/dislike
    // mà không cần đợi response từ API (optimistic update), sau đó điều chỉnh lại
    // dựa trên response.
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

    builder
      // Get Comments By Chapter
      .addCase(getCommentsByChapter.pending, handlePending)
      .addCase(getCommentsByChapter.fulfilled, (state, action) => {
        state.loading = false;
        state.commentsByChapter = action.payload;
      })
      .addCase(getCommentsByChapter.rejected, handleRejected)

      // Get Comments By Novel (Ví dụ, nếu bạn dùng)
      .addCase(getCommentsByNovel.pending, handlePending)
      .addCase(getCommentsByNovel.fulfilled, (state, action) => {
        state.loading = false;
        // state.commentsByNovel = action.payload; // Cập nhật state tương ứng
      })
      .addCase(getCommentsByNovel.rejected, handleRejected)

      // Create Comment
      .addCase(createComment.pending, (state) => { // Không set loading=true nếu muốn UI không bị block
        state.error = null;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.loading = false; // Set loading false khi thành công
        // Thêm comment mới vào đầu danh sách để hiển thị ngay
        if (action.payload && action.payload.idComment) {
          state.commentsByChapter.unshift(action.payload);
        }
      })
      .addCase(createComment.rejected, handleRejected)

      // Delete Comment
      .addCase(deleteComment.pending, (state) => {
        state.error = null; // Không nhất thiết set loading, vì xóa có thể nhanh
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.loading = false;
        state.commentsByChapter = state.commentsByChapter.filter(comment => comment.idComment !== action.payload); // payload là idComment
      })
      .addCase(deleteComment.rejected, handleRejected)

      // === Matchers cho các action update (updateContent, like, dislike) ===
     

      // Get Comments By User (Ví dụ, nếu bạn dùng)
       .addCase(getCommentsByUser.pending, handlePending)
      .addCase(getCommentsByUser.fulfilled, (state, action) => {
        state.loading = false;
        // state.userComments = action.payload; // Cập nhật state tương ứng
      })
      .addCase(getCommentsByUser.rejected, handleRejected)
      .addMatcher(
        (action) => [
          updateCommentContent.pending.type,
          likeComment.pending.type,
          dislikeComment.pending.type
        ].includes(action.type),
        (state) => {
          // Có thể không set loading = true ở đây để UI không bị giật khi like/dislike nhanh
          state.error = null;
        }
      )
      .addMatcher(
        (action) => [
          updateCommentContent.fulfilled.type,
          likeComment.fulfilled.type,
          dislikeComment.fulfilled.type
        ].includes(action.type),
        (state, action) => {
          state.loading = false;
          if (action.payload && action.payload.idComment) {
            const index = state.commentsByChapter.findIndex(comment => comment.idComment === action.payload.idComment);
            if (index !== -1) {
              state.commentsByChapter[index] = action.payload; // Cập nhật comment với data mới từ server
            }
          }
        }
      )
      .addMatcher(
        (action) => [
          updateCommentContent.rejected.type,
          likeComment.rejected.type,
          dislikeComment.rejected.type
        ].includes(action.type),
        (state, action) => {
          state.loading = false;
          state.error = action.payload || 'Comment update/reaction failed';
          // Cân nhắc việc rollback lại trạng thái nếu có optimistic update
        }
      );
  },
});

export const { clearComments, clearCommentError } = commentSlice.actions;
export default commentSlice.reducer;