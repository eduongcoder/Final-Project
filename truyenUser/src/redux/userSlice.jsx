// src/redux/userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const apiBase = "https://truongthaiduongphanthanhvu.onrender.com/user";

// Async Thunks for User
// 1. Login (sau khi Firebase xác thực, backend của bạn có thể cần đồng bộ/tạo user)
export const loginUserByEmail = createAsyncThunk('user/loginByEmail', async (email, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${apiBase}/loginByEmail`, { email });
    if (response.data && response.data.code === 200 && response.data.result) { // Kiểm tra code và result
      return response.data.result; // Trả về thông tin user từ backend của bạn
    } else {
      return rejectWithValue(response.data.message || 'Login failed on backend');
    }
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message || 'An error occurred during login');
  }
});

// 2. Create User (tương tự login, sau Firebase, backend đồng bộ/tạo)
export const createUserByEmail = createAsyncThunk('user/createUserByEmail', async (email, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${apiBase}/createUserByEmail`, { email });
     if (response.data && response.data.code === 200 && response.data.result) {
      return response.data.result;
    } else {
      return rejectWithValue(response.data.message || 'User creation failed on backend');
    }
  } catch (error) {
     return rejectWithValue(error.response?.data?.message || error.message || 'An error occurred during user creation');
  }
});

// 3. Get All Users (chỉ admin nên dùng)
export const getAllUsers = createAsyncThunk('user/getAllUsers', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${apiBase}/getAllUser`);
    if (response.data && response.data.code === 200 && response.data.result) {
        return response.data.result;
    } else {
        return rejectWithValue(response.data.message || 'Failed to fetch users');
    }
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message || 'An error occurred fetching users');
  }
});

// 4. Update User
// body:{ "idUser": "string", "userNameUser": "string", "passwordUser": "string" (optional), "emailUser": "string", "dobUser": "date", "coin": number }
export const updateUser = createAsyncThunk('user/updateUser', async (userData, { rejectWithValue }) => {
  try {
    const response = await axios.put(`${apiBase}/updateUser`, userData);
    if (response.data && response.data.code === 200 && response.data.result) {
        return response.data.result;
    } else {
        return rejectWithValue(response.data.message || 'Failed to update user');
    }
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message || 'An error occurred updating user');
  }
});

// 5. Upload Avatar
// body: FormData (email: string, image: file)
export const uploadAvatar = createAsyncThunk('user/uploadAvatar', async ({ email, imageFile }, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('image', imageFile);

    const response = await axios.post(`${apiBase}/uploadAvatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    if (response.data && response.data.code === 200 && response.data.result) {
        return response.data.result; // Trả về thông tin user đã cập nhật avatar
    } else {
        return rejectWithValue(response.data.message || 'Failed to upload avatar');
    }
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message || 'An error occurred uploading avatar');
  }
});

// 6. Send OTP (chỉ trả về message, không cần lưu vào state user)
export const sendOTP = createAsyncThunk('user/sendOTP', async (email, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${apiBase}/sendOTP`, { email }); // API của bạn nhận email trong body
    if (response.data && response.data.code === 200 && response.data.result) {
        return { otpSent: true, receivedOtp: response.data.result, message: response.data.message }; // Trả về cả OTP nhận được
    } else {
        return rejectWithValue(response.data.message || 'Failed to send OTP');
    }
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message || 'An error occurred sending OTP');
  }
});

// 7. Delete User (chỉ admin nên dùng)
export const deleteUser = createAsyncThunk('user/deleteUser', async (idUser, { rejectWithValue }) => {
  try {
    // API yêu cầu idUser là query param
    const response = await axios.delete(`${apiBase}/deleteUser`, { params: { idUser } });
    if (response.data && response.data.code === 200) { // Check code thành công
        return idUser; // Trả về idUser để xóa khỏi state nếu cần
    } else {
        return rejectWithValue(response.data.message || 'Failed to delete user');
    }
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message || 'An error occurred deleting user');
  }
});

// Slice for User
const userSlice = createSlice({
  name: 'user',
  initialState: {
    currentUser: null, // Thông tin người dùng hiện tại đang đăng nhập
    usersList: [], // Danh sách người dùng (ví dụ cho admin)
    loading: false,
    error: null,
    otpMessage: null, // Để lưu thông báo từ sendOTP nếu cần
  },
  reducers: {
    // Action để logout (xóa currentUser khỏi state)
    logoutUser: (state) => {
      state.currentUser = null;
      state.error = null;
      // Bạn cũng nên gọi hàm signOut của Firebase ở component
    },
    clearUserError: (state) => {
      state.error = null;
    },
    clearOtpMessage: (state) => {
        state.otpMessage = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login User By Email
      .addCase(loginUserByEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUserByEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload; // Lưu thông tin user đã đăng nhập
      })
      .addCase(loginUserByEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
      })

      // Create User By Email
      .addCase(createUserByEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUserByEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload; // User mới được tạo và đăng nhập
      })
      .addCase(createUserByEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'User creation failed';
      })

      // Get All Users
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.usersList = action.payload;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch users';
      })

      // Update User (bao gồm cả upload avatar vì nó trả về user object)
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentUser && state.currentUser.idUser === action.payload.idUser) {
          state.currentUser = { ...state.currentUser, ...action.payload };
        }
        // Cập nhật trong usersList nếu cần (cho admin view)
        const index = state.usersList.findIndex(user => user.idUser === action.payload.idUser);
        if (index !== -1) {
          state.usersList[index] = { ...state.usersList[index], ...action.payload };
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update user';
      })

      // Upload Avatar (cũng cập nhật currentUser)
      .addCase(uploadAvatar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadAvatar.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentUser && state.currentUser.idUser === action.payload.idUser) {
          state.currentUser = { ...state.currentUser, ...action.payload };
        }
         // Cập nhật trong usersList nếu cần
        const index = state.usersList.findIndex(user => user.idUser === action.payload.idUser);
        if (index !== -1) {
          state.usersList[index] = { ...state.usersList[index], ...action.payload };
        }
      })
      .addCase(uploadAvatar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to upload avatar';
      })

      // Send OTP
      .addCase(sendOTP.pending, (state) => {
        state.loading = true; // Có thể không cần set loading cho OTP nếu nó nhanh
        state.error = null;
        state.otpMessage = null;
      })
      .addCase(sendOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.otpMessage = action.payload; // Lưu thông báo thành công/thất bại từ OTP
      })
      .addCase(sendOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to send OTP'; // Hoặc lưu vào otpMessage tùy logic
      })

      // Delete User
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        // Xóa user khỏi usersList nếu admin view
        state.usersList = state.usersList.filter(user => user.idUser !== action.payload);
        // Nếu user bị xóa là currentUser (ví dụ tự xóa tài khoản), thì logout
        if (state.currentUser && state.currentUser.idUser === action.payload) {
          state.currentUser = null;
        }
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete user';
      });
  }
});

export const { logoutUser, clearUserError, clearOtpMessage } = userSlice.actions;
export default userSlice.reducer;