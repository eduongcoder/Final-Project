// src/redux/userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios'; // axios gốc vẫn được dùng cho các API không cần auth (như login, register)
import apiClient from '../services/api'; // Import apiClient đã cấu hình

const userApiBase = "https://truongthaiduongphanthanhvu.onrender.com/user"; // Chỉ dùng cho các API không cần auth

// --- API DEFINITIONS ---

// 1. API ĐĂNG KÝ USER MỚI
export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (registrationPayload, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${userApiBase}/createUser`, registrationPayload, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.data && response.data.code === 1000 && response.data.result) {
        return response.data.result;
      } else if (response.data && response.data.code === 9999) {
        return rejectWithValue(response.data.message || "Unknown error from backend (9999)");
      } else {
        return rejectWithValue(response.data?.message || 'User registration failed: Invalid response.');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.response?.data?.error || error.message || 'Registration API error.';
      return rejectWithValue(errorMsg);
    }
  }
);

// 2. API ĐĂNG NHẬP THƯỜNG (EMAIL & PASSWORD)
export const loginUserWithPassword = createAsyncThunk(
  'user/loginUserWithPassword',
  async (loginCredentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${userApiBase}/login`, loginCredentials, {
        headers: { 'Content-Type': 'application/json' },
      });
      // Giả sử backend trả về: { code: 1000, message: "...", result: { user: {...}, token: "..." } }
      if (response.data && response.data.code === 1000 && response.data.result && response.data.result.token) {
        return response.data.result; // Trả về object chứa user info và token
      } else {
        return rejectWithValue(response.data?.message || 'Login failed: Invalid response or missing token.');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.response?.data?.error || error.message || 'Login API error.';
      return rejectWithValue(errorMsg);
    }
  }
);

// 3. API ĐĂNG NHẬP CHỈ BẰNG EMAIL
export const loginUserByEmailOnly = createAsyncThunk(
  'user/loginByEmailOnly',
  async (emailPayload, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${userApiBase}/loginByEmail`, emailPayload, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.data && response.data.code === 1000 && response.data.result && response.data.result.token) {
        return response.data.result;
      } else {
        return rejectWithValue(response.data?.message || 'Login (by email only) failed: Invalid response or missing token.');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.response?.data?.error || error.message || 'Login (by email only) API error.';
      return rejectWithValue(errorMsg);
    }
  }
);

// 4. API CREATE USER BY EMAIL (GOOGLE LOGIN/SYNC)
export const createUserByEmailOnly = createAsyncThunk(
  'user/createUserByEmailOnly',
  async (emailPayload, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${userApiBase}/createUserByEmail`, emailPayload, {
        headers: { 'Content-Type': 'application/json' },
      });
      // Giả sử API này cũng trả về token nếu user được tạo mới và tự động login
      if (response.data && response.data.code === 1000 && response.data.result && response.data.result.token) {
        return response.data.result;
      } else if (response.data && response.data.code === 1000 && response.data.result) {
        // Trường hợp chỉ trả về user info, không có token (ví dụ: user đã tồn tại)
        return { ...response.data.result, token: null }; // Trả về token là null để không ghi đè token hiện có nếu có
      } else {
        return rejectWithValue(response.data?.message || 'Create user (by email only) failed: Invalid response.');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.response?.data?.error || error.message || 'Create user (by email only) API error.';
      return rejectWithValue(errorMsg);
    }
  }
);

// 5. API Send OTP - Sử dụng apiClient nếu cần xác thực (ví dụ: đổi mật khẩu)
export const sendOTP = createAsyncThunk(
  'user/sendOTP',
  async (emailData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('email', emailData.email);
      // Nếu sendOTP không cần token, dùng axios.post(`${userApiBase}/sendOTP`, formData);
      const response = await apiClient.post(`/user/sendOTP`, formData); // Đường dẫn tương đối với baseURL của apiClient
      if (response.data && response.data.code === 1000 && response.data.result) {
        return {
          otpSent: true,
          receivedOtp: response.data.result,
          message: response.data.message || "OTP sent successfully"
        };
      } else {
        return rejectWithValue(response.data?.message || 'Send OTP failed: Invalid response.');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.response?.data?.error || error.message || 'Send OTP API error.';
      return rejectWithValue(errorMsg);
    }
  }
);

// 6. API Upload Avatar - Sử dụng apiClient
export const uploadAvatar = createAsyncThunk(
  'user/uploadAvatar',
  async ({ email, imageFile }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      const response = await apiClient.post(`/user/uploadAvatar?email=${encodeURIComponent(email)}`, formData);
      if (response.data && response.data.code === 1000 && response.data.result) {
        return response.data.result; // Backend nên trả về object user đã cập nhật
      } else {
        return rejectWithValue(response.data?.message || 'Upload avatar failed: Invalid response.');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.response?.data?.error || error.message || 'Upload avatar API error.';
      return rejectWithValue(errorMsg);
    }
  }
);

// 7. API CREATE HISTORY - Sử dụng apiClient
export const createHistory = createAsyncThunk(
  'user/createHistory',
  async ({ idNovel, email, titleChapter }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(
        `/user/createHistory?idNovel=${encodeURIComponent(idNovel)}&email=${encodeURIComponent(email)}&titleChapter=${encodeURIComponent(titleChapter)}`
      );
      if (response.data && (response.data.code === "1000" || response.data.code === 1000)) {
        return response.data;
      } else {
        return rejectWithValue(response.data?.message || 'Create history failed: Invalid response.');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.response?.data?.error || error.message || 'Create history API error.';
      return rejectWithValue(errorMsg);
    }
  }
);

// 8. API DELETE HISTORY - Sử dụng apiClient
export const deleteHistory = createAsyncThunk(
  'user/deleteHistory',
  async (historyData, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete(`/user/deleteHistory`, { data: historyData });
      if (response.data && (response.data.code === "1000" || response.data.code === 1000)) {
        return response.data;
      } else {
        return rejectWithValue(response.data?.message || 'Delete history failed: Invalid response.');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.response?.data?.error || error.message || 'Delete history API error.';
      return rejectWithValue(errorMsg);
    }
  }
);

// 9. API GET ALL HISTORY BY USER - Sử dụng apiClient
export const getAllHistoryByUser = createAsyncThunk(
  'user/getAllHistoryByUser',
  async (idUser, { rejectWithValue }) => { // Đổi thành idUser nếu API dùng idUser
    try {
      const response = await apiClient.get(`/user/getHistory?idUser=${encodeURIComponent(idUser)}`);
      if (response.data && (response.data.code === 1000 || response.data.code === "1000") && Array.isArray(response.data.result)) {
        return response.data.result;
      } else if (response.data && (response.data.code === 1000 || response.data.code === "1000") && response.data.result === null) {
        return [];
      } else {
        return rejectWithValue(response.data?.message || 'Failed to fetch history: Invalid response.');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.response?.data?.error || error.message || 'Get all history API error.';
      return rejectWithValue(errorMsg);
    }
  }
);


// --- SLICE DEFINITION ---
const initialState = {
  currentUser: null, // Sẽ lưu thông tin user (không bao gồm token)
  token: localStorage.getItem('authToken') || null, // Chỉ lưu token
  usersList: [],
  userHistory: [],
  loading: false,
  isOtpSending: false,
  isHistoryLoading: false,
  error: null,
  otpMessage: null,
  historyActionStatus: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logoutUser: (state) => {
      state.currentUser = null;
      state.token = null;
      state.error = null;
      state.historyActionStatus = null;
      state.userHistory = [];
      state.otpMessage = null;
      localStorage.removeItem('currentUser');
      localStorage.removeItem('authToken');
    },
    clearUserError: (state) => { state.error = null; },
    clearOtpMessage: (state) => { state.otpMessage = null; },
    clearHistoryActionStatus: (state) => { state.historyActionStatus = null; },
    loadUserFromStorage: (state) => {
      const savedUserString = localStorage.getItem('currentUser');
      const savedToken = localStorage.getItem('authToken');
      if (savedUserString) {
        try {
          state.currentUser = JSON.parse(savedUserString);
        } catch (e) {
          console.error("Error parsing currentUser from localStorage", e);
          localStorage.removeItem('currentUser');
        }
      }
      if (savedToken) {
        state.token = savedToken;
      }
    },
    clearUserHistory: (state) => {
      state.userHistory = [];
      state.isHistoryLoading = false;
    }
  },
  extraReducers: (builder) => {
    const handleAuthSuccess = (state, action) => {
      state.loading = false;
      // Giả sử action.payload là { user: {...}, token: "..." }
      // Hoặc action.payload là object user đã chứa token: action.payload.token
      // Hoặc action.payload chỉ là user, và token nằm ở response.data.token (cần điều chỉnh)
      const userData = action.payload.user || action.payload; // Lấy thông tin user
      const token = action.payload.token;

      state.currentUser = userData;
      if (token) { // Chỉ cập nhật token nếu có token mới
        state.token = token;
        localStorage.setItem('authToken', token);
      }
      localStorage.setItem('currentUser', JSON.stringify(userData)); // Lưu user info (không có token)
      state.userHistory = []; // Xóa lịch sử của người dùng cũ
      state.error = null;
    };

    const handleAuthPending = (state) => {
      state.loading = true;
      state.error = null;
    };

    const handleAuthRejected = (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.currentUser = null;
      state.token = null;
      localStorage.removeItem('currentUser');
      localStorage.removeItem('authToken');
    };

    builder
      // Register User
      .addCase(registerUser.pending, handleAuthPending)
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        // Đăng ký thành công có thể chưa đăng nhập ngay, chỉ set currentUser
        state.currentUser = action.payload; // Payload là user info
        // Token sẽ được set khi login
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Login User With Password & Login User By Email Only & Create User By Email Only
      

      // Send OTP
      .addCase(sendOTP.pending, (state) => { state.isOtpSending = true; state.error = null; state.otpMessage = null; })
      .addCase(sendOTP.fulfilled, (state, action) => { state.isOtpSending = false; state.otpMessage = action.payload.message; })
      .addCase(sendOTP.rejected, (state, action) => { state.isOtpSending = false; state.error = action.payload; })

      // Upload Avatar
      .addCase(uploadAvatar.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(uploadAvatar.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentUser && state.currentUser.emailUser === action.payload.emailUser) {
          // Giả sử action.payload là object user đã được cập nhật từ backend
          state.currentUser = { ...state.currentUser, ...action.payload };
          localStorage.setItem('currentUser', JSON.stringify(state.currentUser));
        }
      })
      .addCase(uploadAvatar.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      // Create History
      .addCase(createHistory.pending, (state) => { state.loading = true; state.error = null; state.historyActionStatus = null; })
      .addCase(createHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.historyActionStatus = action.payload.message || 'History created successfully.';
      })
      .addCase(createHistory.rejected, (state, action) => { state.loading = false; state.error = action.payload; state.historyActionStatus = null; })

      // Delete History
      .addCase(deleteHistory.pending, (state) => { state.loading = true; state.error = null; state.historyActionStatus = null; })
      .addCase(deleteHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.historyActionStatus = action.payload.message || 'History deleted successfully.';
        // Cân nhắc reload lại history ở đây hoặc để component tự gọi lại getAllHistoryByUser
      })
      .addCase(deleteHistory.rejected, (state, action) => { state.loading = false; state.error = action.payload; state.historyActionStatus = null; })

      // Get All History By User
      .addCase(getAllHistoryByUser.pending, (state) => { state.isHistoryLoading = true; state.error = null; })
      .addCase(getAllHistoryByUser.fulfilled, (state, action) => {
        state.isHistoryLoading = false;
        state.userHistory = action.payload;
      })
      .addCase(getAllHistoryByUser.rejected, (state, action) => {
        state.isHistoryLoading = false;
        state.error = action.payload;
        state.userHistory = [];
      })
      .addMatcher(
        (action) => [
          loginUserWithPassword.fulfilled.type,
          loginUserByEmailOnly.fulfilled.type,
          createUserByEmailOnly.fulfilled.type, // Nếu createUserByEmailOnly cũng đăng nhập và trả token
        ].includes(action.type),
        handleAuthSuccess
      )
      .addMatcher(
        (action) => [
          loginUserWithPassword.pending.type,
          loginUserByEmailOnly.pending.type,
          createUserByEmailOnly.pending.type,
        ].includes(action.type),
        handleAuthPending
      )
      .addMatcher(
        (action) => [
          loginUserWithPassword.rejected.type,
          loginUserByEmailOnly.rejected.type,
          createUserByEmailOnly.rejected.type,
        ].includes(action.type),
        handleAuthRejected
      )
      ;
  }
});

export const {
  logoutUser,
  clearUserError,
  clearOtpMessage,
  loadUserFromStorage,
  clearHistoryActionStatus,
  clearUserHistory
} = userSlice.actions;

export const selectAuthToken = (state) => state.user.token;
export const selectCurrentUser = (state) => state.user.currentUser;


export default userSlice.reducer;