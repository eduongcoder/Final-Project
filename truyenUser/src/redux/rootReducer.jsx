// src/redux/rootReducer.js
import { combineReducers } from 'redux';
import novelReducer from './novelSlice';
import authorReducer from './authorSlice';
import categoryReducer from './categorySlice';
import chapterReducer from './chapterSlice';
const rootReducer = combineReducers({
  novels: novelReducer,
  authors: authorReducer,
  categories: categoryReducer,
  chapters: chapterReducer
});

export default rootReducer;
