import { configureStore } from '@reduxjs/toolkit';
import userReducer from './Slice'; 

const store = configureStore({
  reducer: {
    User: userReducer, 
  },
});

export default store;
