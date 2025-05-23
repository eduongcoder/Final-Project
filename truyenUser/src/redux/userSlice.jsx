// src/redux/userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const apiBase = "https://truongthaiduongphanthanhvu.onrender.com/user";

// --- API DEFINITIONS BASED ON YOUR REQUIREMENTS ---

// 1. API ĐĂNG KÝ USER MỚI (SAU KHI XÁC THỰC OTP)
// Endpoint: /user/create (Hoặc /user/register - BẠN CẦN XÁC NHẬN VÀ THAY THẾ)
// Payload: { emailUser, passwordUser, dobUser, coin } - application/json
export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (registrationPayload, { rejectWithValue }) => {
    try {
      console.log("FRONTEND: Calling API to register user with JSON payload:", JSON.stringify(registrationPayload, null, 2));
      // THAY THẾ '/create' BẰNG ENDPOINT ĐÚNG CỦA BẠN CHO API ĐĂNG KÝ
      const response = await axios.post(`${apiBase}/createUser`, registrationPayload, {
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
      console.error("registerUser API error:", errorMsg, error.response || error);
      return rejectWithValue(errorMsg);
    }
  }
);

// 2. API ĐĂNG NHẬP THƯỜNG (EMAIL & PASSWORD)
// Endpoint: /user/login
// Payload: { email, password } - application/json
export const loginUserWithPassword = createAsyncThunk(
  'user/loginUserWithPassword',
  async (loginCredentials, { rejectWithValue }) => { // loginCredentials: { email, password }
    try {
      console.log("Attempting to login (email/password) with:", loginCredentials);
      const response = await axios.post(`${apiBase}/login`, loginCredentials, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.data && response.data.code === 1000 && response.data.result) {
        return response.data.result;
      } else {
        return rejectWithValue(response.data?.message || 'Login (email/password) failed: Invalid response.');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.response?.data?.error || error.message || 'Login (email/password) API error.';
      console.error("loginUserWithPassword API error:", errorMsg, error.response || error);
      return rejectWithValue(errorMsg);
    }
  }
);

// 3. API ĐĂNG NHẬP CHỈ BẰNG EMAIL (Ví dụ: sau khi xác thực qua nguồn khác)
// Endpoint: /user/loginByEmail
// Payload: { email } - application/json
export const loginUserByEmailOnly = createAsyncThunk(
  'user/loginByEmailOnly',
  async (emailPayload, { rejectWithValue }) => { // emailPayload: { email }
    try {
      console.log("Attempting to login (by email only) with:", emailPayload);
      const response = await axios.post(`${apiBase}/loginByEmail`, emailPayload, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.data && response.data.code === 1000 && response.data.result) {
        return response.data.result;
      } else {
        return rejectWithValue(response.data?.message || 'Login (by email only) failed: Invalid response.');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.response?.data?.error || error.message || 'Login (by email only) API error.';
      console.error("loginUserByEmailOnly API error:", errorMsg, error.response || error);
      return rejectWithValue(errorMsg);
    }
  }
);


// 4. API CREATE USER BY EMAIL (Dùng cho Google Sync hoặc khi chỉ có email ban đầu)
// Endpoint: /user/createUserByEmail
// Payload: { email } - application/json
// Backend có thể tự tạo các trường khác hoặc yêu cầu cập nhật sau.
export const createUserByEmailOnly = createAsyncThunk(
  'user/createUserByEmailOnly',
  async (emailPayload, { rejectWithValue }) => { // emailPayload: { email, displayName?, photoURL?, firebaseUid? }
    try {
      console.log("Attempting to create/sync user (by email only, e.g., Google) with:", emailPayload);
      const response = await axios.post(`${apiBase}/createUserByEmail`, emailPayload, {
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.data && response.data.code === 1000 && response.data.result) {
        return response.data.result;
      } else {
        return rejectWithValue(response.data?.message || 'Create user (by email only) failed: Invalid response.');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.response?.data?.error || error.message || 'Create user (by email only) API error.';
      console.error("createUserByEmailOnly API error:", errorMsg, error.response || error);
      return rejectWithValue(errorMsg);
    }
  }
);

// 5. API Send OTP
// Endpoint: /user/sendOTP
// Payload: FormData với trường 'email'
export const sendOTP = createAsyncThunk(
  'user/sendOTP',
  async (emailData, { rejectWithValue }) => { // emailData: { email }
    try {
      const formData = new FormData();
      formData.append('email', emailData.email); // Tên trường 'email' cho FormData

      const response = await axios.post(`${apiBase}/sendOTP`, formData);
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
      console.error("sendOTP API error:", errorMsg, error.response || error);
      return rejectWithValue(errorMsg);
    }
  }
);

// 6. API Upload Avatar
// Endpoint: /user/uploadAvatar
// Query param: email
// Request body: FormData với trường 'image'
export const uploadAvatar = createAsyncThunk(
  'user/uploadAvatar',
  async ({ email, imageFile }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);

      // email được gửi như một query parameter
      const response = await axios.post(`${apiBase}/uploadAvatar?email=${encodeURIComponent(email)}`, formData);
      // Axios tự đặt Content-Type cho FormData

      if (response.data && response.data.code === 1000 && response.data.result) {
        return response.data.result; // Trả về user object đã cập nhật avatar
      } else {
        return rejectWithValue(response.data?.message || 'Upload avatar failed: Invalid response.');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.response?.data?.error || error.message || 'Upload avatar API error.';
      console.error("uploadAvatar API error:", errorMsg, error.response || error);
      return rejectWithValue(errorMsg);
    }
  }
);

// --- SLICE DEFINITION ---
const userSlice = createSlice({
  name: 'user',
  initialState: {
    currentUser: null,
    usersList: [], // Ví dụ cho admin
    loading: false, // Loading chung cho các action chính
    isOtpSending: false, // Loading riêng cho OTP
    error: null,
    otpMessage: null,
  },
  reducers: {
    logoutUser: (state) => { state.currentUser = null; state.error = null; },
    clearUserError: (state) => { state.error = null; },
    clearOtpMessage: (state) => { state.otpMessage = null; }
  },
  extraReducers: (builder) => {
    builder
      // Register User
      .addCase(registerUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(registerUser.fulfilled, (state, action) => { state.loading = false; state.currentUser = action.payload; })
      .addCase(registerUser.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      // Login User With Password
      .addCase(loginUserWithPassword.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginUserWithPassword.fulfilled, (state, action) => { state.loading = false; state.currentUser = action.payload; })
      .addCase(loginUserWithPassword.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      // Login User By Email Only
      .addCase(loginUserByEmailOnly.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginUserByEmailOnly.fulfilled, (state, action) => { state.loading = false; state.currentUser = action.payload; })
      .addCase(loginUserByEmailOnly.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      // Create User By Email Only (Google Sync)
      .addCase(createUserByEmailOnly.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(createUserByEmailOnly.fulfilled, (state, action) => { state.loading = false; state.currentUser = action.payload; })
      .addCase(createUserByEmailOnly.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      // Send OTP
      .addCase(sendOTP.pending, (state) => { state.isOtpSending = true; state.error = null; state.otpMessage = null; })
      .addCase(sendOTP.fulfilled, (state, action) => { state.isOtpSending = false; state.otpMessage = action.payload.message; })
      .addCase(sendOTP.rejected, (state, action) => { state.isOtpSending = false; state.error = action.payload; /* Hoặc otpMessage */ })

      // Upload Avatar
      .addCase(uploadAvatar.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(uploadAvatar.fulfilled, (state, action) => {
        state.loading = false;
        // Cập nhật currentUser nếu avatar được upload cho người dùng hiện tại
        if (state.currentUser && state.currentUser.emailUser === action.payload.emailUser) { // Giả sử result có emailUser
          state.currentUser = { ...state.currentUser, ...action.payload };
        }
      })
      .addCase(uploadAvatar.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
    // ... Thêm các cases cho getAllUsers, updateUser, deleteUser nếu có ...
  }
});

export const { logoutUser, clearUserError, clearOtpMessage } = userSlice.actions;
export default userSlice.reducer;