import { combineReducers } from '@reduxjs/toolkit'; // Sửa lại nếu bạn dùng configureStore trực tiếp
import novelReducer from './novelSlice';
import authorReducer from './authorSlice';
import categoryReducer from './categorySlice';
import chapterReducer from './chapterSlice';
import userReducer from './userSlice'; // Đảm bảo tên này đúng
import commentsReducer from './commentSlice';

const rootReducer = combineReducers({
  novels: novelReducer,
  authors: authorReducer,
  categories: categoryReducer,
  chapters: chapterReducer,
  user: userReducer, // Key 'user' phải khớp với state.user
  comments: commentsReducer,
});

export default rootReducer;