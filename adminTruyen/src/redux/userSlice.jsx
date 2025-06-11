// src/redux/userSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import apiClient from '../services/api';

const userApiBase = "https://truongthaiduongphanthanhvu.onrender.com/user";

// --- THUNK MỚI: XÁC THỰC PHIÊN ĐĂNG NHẬP KHI TẢI LẠI TRANG ---
// Action này sẽ được gọi khi ứng dụng khởi động để kiểm tra token cũ.
export const verifyUserSession = createAsyncThunk(
  'user/verifySession',
  async (_, { rejectWithValue, getState }) => {
    const { token } = getState().user;
    if (!token) {
      // Nếu không có token, không cần gọi API, chỉ cần kết thúc.
      return rejectWithValue('No token found');
    }
    
    try {
      // Giả sử bạn có endpoint /user/me để lấy thông tin user dựa trên token
      // apiClient sẽ tự động đính kèm token vào header
      const response = await apiClient.get('/user/me'); 
      if (response.data && response.data.code === 1000 && response.data.result) {
        // Thành công: trả về thông tin user mới nhất
        return response.data.result;
      }
      return rejectWithValue('Invalid session data from server.');
    } catch (error) {
      // Thất bại (token hết hạn/không hợp lệ), server trả về lỗi 401/403
      console.error("Session verification failed:", error.response?.data);
      return rejectWithValue('Session expired or invalid.');
    }
  }
);


// --- CÁC THUNK KHÁC (GIỮ NGUYÊN) ---
export const registerUser = createAsyncThunk(/* ...code của bạn... */);
export const loginUserWithPassword = createAsyncThunk(
  'user/loginUserWithPassword',
  async (loginCredentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${userApiBase}/login`, loginCredentials);
      if (response.data && response.data.code === 1000 && response.data.result && response.data.result.token) {
        // Lưu token vào localStorage NGAY LẬP TỨC sau khi đăng nhập thành công
        localStorage.setItem('authToken', response.data.result.token);
        return response.data.result;
      } else {
        return rejectWithValue(response.data?.message || 'Login failed');
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login API error.');
    }
  }
);
// ... các thunk khác của bạn ...


// --- SLICE DEFINITION (CẬP NHẬT) ---

const initialState = {
  currentUser: null,
  token: localStorage.getItem('authToken') || null,
  usersList: [],
  userHistory: [],
  loading: false, // Loading cho các action thông thường (login, create,...)
  // Thêm trạng thái loading RIÊNG cho việc xác thực phiên khi tải lại trang
  isVerifyingSession: true, // Bắt đầu là `true` để hiển thị màn hình chờ
  error: null,
  // ... các state khác
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logoutUser: (state) => {
      state.currentUser = null;
      state.token = null;
      state.error = null;
      state.isVerifyingSession = false; // Khi logout, không cần xác thực nữa
      localStorage.removeItem('currentUser');
      localStorage.removeItem('authToken');
      // ... reset các state khác
    },
    // Action này giờ chỉ mang tính tham khảo, logic chính nằm ở verifyUserSession
    loadUserFromStorage: (state) => {
      const savedUserString = localStorage.getItem('currentUser');
      if (savedUserString) {
        try {
          state.currentUser = JSON.parse(savedUserString);
        } catch (e) { console.error(e); }
      }
    },
    // ... các reducer khác
  },
  extraReducers: (builder) => {
    const handleAuthSuccess = (state, action) => {
      state.loading = false;
      state.isVerifyingSession = false; // Đăng nhập xong, phiên đã hợp lệ
      const userData = action.payload.user || action.payload;
      const token = action.payload.token;

      state.currentUser = userData;
      if (token) {
        state.token = token;
        // localStorage đã được set trong thunk, nhưng set lại ở đây để chắc chắn
        localStorage.setItem('authToken', token);
      }
      localStorage.setItem('currentUser', JSON.stringify(userData));
      state.error = null;
    };
    
    // ... (builder cho register, các action khác giữ nguyên)

    // Xử lý cho matcher (đã bao gồm loginUserWithPassword)
   
      // ... các matcher khác

    // --- XỬ LÝ CHO THUNK MỚI `verifyUserSession` ---
    builder
      .addCase(verifyUserSession.pending, (state) => {
        state.isVerifyingSession = true;
      })
      .addCase(verifyUserSession.fulfilled, (state, action) => {
        state.isVerifyingSession = false;
        state.currentUser = action.payload; // Cập nhật user với data mới nhất
        localStorage.setItem('currentUser', JSON.stringify(action.payload));
        state.error = null;
      })
      .addCase(verifyUserSession.rejected, (state, action) => {
        state.isVerifyingSession = false; // Đã xác thực xong (dù thất bại)
        state.currentUser = null;
        state.token = null;
        localStorage.removeItem('currentUser');
        localStorage.removeItem('authToken');
        console.log('Session rejected:', action.payload);
      });
       builder
      .addMatcher(
        (action) => [
          loginUserWithPassword.fulfilled.type,
          // ... các action login khác
        ].includes(action.type),
        handleAuthSuccess
      )
  }
});

export const { logoutUser, loadUserFromStorage,clearUserError, // THÊM LẠI clearUserError VÀO ĐÂY
  clearOtpMessage,
  clearHistoryActionStatus,
  clearUserHistory } = userSlice.actions;
export default userSlice.reducer;