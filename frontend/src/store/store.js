import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice.js'
import userReducer from '../features/userSlice.js';
import postReducer from '../features/postSlice.js'
import conversationReducer from '../features/conversationSlice.js'
import selectedConvReducer from '../features/selectedConversationSlice.js';

const store = configureStore({
    reducer: {
        auth: authReducer, // Add the auth reducer to the store
        user:userReducer,  // Add the user reducer to the store
        post:postReducer,  // Add the Post reduces to the store
        conversation : conversationReducer, // Add the conversation reducer to the store
        selectedConversation: selectedConvReducer, // ADD the selected conversatin reduser to store
    },
});

export default store;