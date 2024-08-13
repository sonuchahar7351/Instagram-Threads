import { createSlice } from '@reduxjs/toolkit';

const initialState = {
      _id: "",
      userId: "",
      username: "",
      profilePic: ""
  };

const selectedConversationSlice = createSlice({
      name:"selectedConversation",
      initialState,
      reducers:{
            setSelectedConversation: (state, action) => {
                  return { ...state, ...action.payload };
              },
              clearSelectedConversation: () => initialState
      }

})

export const { setSelectedConversation, clearSelectedConversation } = selectedConversationSlice.actions;

// Export the reducer
export default selectedConversationSlice.reducer;