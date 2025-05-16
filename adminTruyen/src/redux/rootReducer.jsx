// src/redux/rootReducer.js
import { combineReducers } from 'redux';
import novelReducer from './novelSlice';
import authorReducer from './authorSlice';
import categoryReducer from './categorySlice';

const rootReducer = combineReducers({
  novels: novelReducer,
  authors: authorReducer,
  categories: categoryReducer
});

export default rootReducer;
