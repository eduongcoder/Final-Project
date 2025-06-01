// src/redux/userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const apiBase = "https://truongthaiduongphanthanhvu.onrender.com/user";

// --- API DEFINITIONS BASED ON YOUR REQUIREMENTS ---

// 1. API ĐĂNG KÝ USER MỚI (SAU KHI XÁC THỰC OTP)
export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (registrationPayload, { rejectWithValue }) => {
    try {
      console.log("FRONTEND: Calling API to register user with JSON payload:", JSON.stringify(registrationPayload, null, 2));
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
export const loginUserWithPassword = createAsyncThunk(
  'user/loginUserWithPassword',
  async (loginCredentials, { rejectWithValue }) => {
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

// 3. API ĐĂNG NHẬP CHỈ BẰNG EMAIL
export const loginUserByEmailOnly = createAsyncThunk(
  'user/loginByEmailOnly',
  async (emailPayload, { rejectWithValue }) => {
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

// 4. API CREATE USER BY EMAIL
export const createUserByEmailOnly = createAsyncThunk(
  'user/createUserByEmailOnly',
  async (emailPayload, { rejectWithValue }) => {
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
export const sendOTP = createAsyncThunk(
  'user/sendOTP',
  async (emailData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('email', emailData.email);

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
export const uploadAvatar = createAsyncThunk(
  'user/uploadAvatar',
  async ({ email, imageFile }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);

      const response = await axios.post(`${apiBase}/uploadAvatar?email=${encodeURIComponent(email)}`, formData);

      if (response.data && response.data.code === 1000 && response.data.result) {
        return response.data.result;
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

// 7. API CREATE HISTORY
export const createHistory = createAsyncThunk(
  'user/createHistory',
  async ({ idNovel, email, titleChapter }, { rejectWithValue }) => {
    try {
      console.log("Attempting to create history with:", { idNovel, email, titleChapter });
      const response = await axios.post(
        `${apiBase}/createHistory?idNovel=${encodeURIComponent(idNovel)}&email=${encodeURIComponent(email)}&titleChapter=${encodeURIComponent(titleChapter)}`
      );

      if (response.data && (response.data.code === "1000" || response.data.code === 1000)) {
        return response.data;
      } else {
        return rejectWithValue(response.data?.message || 'Create history failed: Invalid response.');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.response?.data?.error || error.message || 'Create history API error.';
      console.error("createHistory API error:", errorMsg, error.response || error);
      return rejectWithValue(errorMsg);
    }
  }
);

// 8. API DELETE HISTORY
export const deleteHistory = createAsyncThunk(
  'user/deleteHistory',
  async (historyData, { rejectWithValue }) => {
    try {
      console.log("Attempting to delete history with:", historyData);
      const response = await axios.delete(`${apiBase}/deleteHistory`, {
        data: historyData,
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.data && (response.data.code === "1000" || response.data.code === 1000)) {
        return response.data;
      } else {
        return rejectWithValue(response.data?.message || 'Delete history failed: Invalid response.');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.response?.data?.error || error.message || 'Delete history API error.';
      console.error("deleteHistory API error:", errorMsg, error.response || error);
      return rejectWithValue(errorMsg);
    }
  }
);

// 9. API GET ALL HISTORY BY USER
// Assuming GET /user/getAllHistoryByUser?email={email}
export const getAllHistoryByUser = createAsyncThunk(
  'user/getAllHistoryByUser',
  async (idu, { rejectWithValue }) => { // email is the user's email
    try {
      console.log("Attempting to fetch all history for email:", idu);
      const response = await axios.get(`${apiBase}/getHistory?idUser=${encodeURIComponent(idu)}`);

      // Assuming the backend returns code 1000 (number) or "1000" (string) for success
      // And response.data.result is an array of history items
      if (response.data && (response.data.code === 1000 || response.data.code === "1000") && Array.isArray(response.data.result)) {
        return response.data.result; // Return the array of history items
      } else if (response.data && (response.data.code === 1000 || response.data.code === "1000") && response.data.result === null) {
        // Handle case where history is empty but API call is successful
        return [];
      }
      else {
        return rejectWithValue(response.data?.message || 'Failed to fetch history: Invalid response.');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.response?.data?.error || error.message || 'Get all history API error.';
      console.error("getAllHistoryByUser API error:", errorMsg, error.response || error);
      return rejectWithValue(errorMsg);
    }
  }
);


// --- SLICE DEFINITION ---
const userSlice = createSlice({
  name: 'user',
  initialState: {
    currentUser: null,
    usersList: [], // For admin purposes, if needed
    userHistory: [], // To store fetched history items for the current user
    loading: false,
    isOtpSending: false,
    isHistoryLoading: false, // Specific loading state for history fetching
    error: null,
    otpMessage: null,
    historyActionStatus: null, // Messages from create/delete history actions
  },
  reducers: {
    logoutUser: (state) => {
      state.currentUser = null;
      state.error = null;
      state.historyActionStatus = null;
      state.userHistory = []; // Clear history on logout
      state.otpMessage = null;
      localStorage.removeItem('currentUser');
    },
    clearUserError: (state) => { state.error = null; },
    clearOtpMessage: (state) => { state.otpMessage = null; },
    clearHistoryActionStatus: (state) => { state.historyActionStatus = null; },
    loadUserFromStorage: (state) => {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        state.currentUser = JSON.parse(savedUser);
      }
    },
    // Optional: A reducer to manually clear history if needed elsewhere
    clearUserHistory: (state) => {
      state.userHistory = [];
      state.isHistoryLoading = false; // Reset loading state as well
    }
  },
  extraReducers: (builder) => {
    builder
      // Register User
      .addCase(registerUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(registerUser.fulfilled, (state, action) => { state.loading = false; state.currentUser = action.payload; })
      .addCase(registerUser.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      // Login User With Password
      .addCase(loginUserWithPassword.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginUserWithPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
        state.userHistory = []; // Clear previous user's history
        localStorage.setItem('currentUser', JSON.stringify(action.payload));
      })
      .addCase(loginUserWithPassword.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      // Login User By Email Only
      .addCase(loginUserByEmailOnly.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginUserByEmailOnly.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
        state.userHistory = []; // Clear previous user's history
        localStorage.setItem('currentUser', JSON.stringify(action.payload));
      })
      .addCase(loginUserByEmailOnly.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      // Create User By Email Only (Google Sync)
      .addCase(createUserByEmailOnly.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(createUserByEmailOnly.fulfilled, (state, action) => { state.loading = false; state.currentUser = action.payload; state.userHistory = []; }) // Clear history for new user
      .addCase(createUserByEmailOnly.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      // Send OTP
      .addCase(sendOTP.pending, (state) => { state.isOtpSending = true; state.error = null; state.otpMessage = null; })
      .addCase(sendOTP.fulfilled, (state, action) => { state.isOtpSending = false; state.otpMessage = action.payload.message; })
      .addCase(sendOTP.rejected, (state, action) => { state.isOtpSending = false; state.error = action.payload; })

      // Upload Avatar
      .addCase(uploadAvatar.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(uploadAvatar.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentUser && state.currentUser.emailUser === action.payload.emailUser) {
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
        // Consider re-fetching history or adding the new item to state.userHistory if the API returns it
        // For now, just a status. User might need to call getAllHistoryByUser again.
      })
      .addCase(createHistory.rejected, (state, action) => { state.loading = false; state.error = action.payload; state.historyActionStatus = null; })

      // Delete History
      .addCase(deleteHistory.pending, (state) => { state.loading = true; state.error = null; state.historyActionStatus = null; })
      .addCase(deleteHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.historyActionStatus = action.payload.message || 'History deleted successfully.';
        // Consider re-fetching history or removing the item from state.userHistory
        // For now, just a status. User might need to call getAllHistoryByUser again.
        // If you know the idNovel and idUser from the delete action, you could filter state.userHistory
        // const { idUser, idNovel } = action.meta.arg; // Access payload sent to thunk
        // if (state.currentUser && state.currentUser.idUser === idUser) {
        //   state.userHistory = state.userHistory.filter(item => item.idNovel !== idNovel);
        // }
      })
      .addCase(deleteHistory.rejected, (state, action) => { state.loading = false; state.error = action.payload; state.historyActionStatus = null; })

      // Get All History By User
      .addCase(getAllHistoryByUser.pending, (state) => {
        state.isHistoryLoading = true;
        state.error = null; // Clear previous errors
      })
      .addCase(getAllHistoryByUser.fulfilled, (state, action) => {
        state.isHistoryLoading = false;
        state.userHistory = action.payload; // Payload is the array of history items
      })
      .addCase(getAllHistoryByUser.rejected, (state, action) => {
        state.isHistoryLoading = false;
        state.error = action.payload; // Store error message
        state.userHistory = []; // Optionally clear history on error or keep stale
      });
  }
});

export const {
  logoutUser,
  clearUserError,
  clearOtpMessage,
  loadUserFromStorage,
  clearHistoryActionStatus,
  clearUserHistory // Export new reducer
} = userSlice.actions;

export default userSlice.reducer;