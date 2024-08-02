import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice.js'
import userReducer from '../features/userSlice.js'
//import authReducer from './authSlice'; // Adjust the path as necessary

const store = configureStore({
    reducer: {
        auth: authReducer, // Add the auth reducer to the store
        user:userReducer,  // Add the user reducer to the store
    },
});

export default store;