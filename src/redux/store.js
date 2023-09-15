import { configureStore } from "@reduxjs/toolkit";
import userReducer from './authslice';


export const store = configureStore({
    reducer:{
      user:userReducer  
    },
});