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
                  state.posts.unshift(action.payload); // Add a single post
            },
            // removePost(state, action) {
            //       state.posts = state.posts.filter(post => post.id !== action.payload); // Remove post by ID
            //     },
      }
});
export const { fetchedPosts, addPost} = postSlice.actions;
export default postSlice.reducer;