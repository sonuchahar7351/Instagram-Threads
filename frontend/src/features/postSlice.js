import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
      name: "post",
      initialState: {
            posts: [],
      },    
      reducers: { 
            fetchedPosts(state, action) {
                  state.posts = action.payload;
            },
            addPost(state, action) {
                  state.posts.unshift(action.payload); 
            },
           
      }
});
export const { fetchedPosts, addPost} = postSlice.actions;
export default postSlice.reducer;