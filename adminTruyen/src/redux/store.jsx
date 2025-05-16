// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';
import Author from './authorSlice';
const store = configureStore({
  reducer: rootReducer

});

export default store;
