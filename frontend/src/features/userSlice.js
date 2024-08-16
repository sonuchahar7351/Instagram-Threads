import { createSlice } from "@reduxjs/toolkit";

const initialState = {
      preUser: JSON.parse(localStorage.getItem('user-threads')) || null
};

const userSlice = createSlice({
      name: 'user',
      initialState,
      reducers: {
            setUser(state, action) {
                  state.preUser = action.payload; // Update the screen state
            },
      },
})

// Export the action creator
export const { setUser } = userSlice.actions;

// Export the reducer
export default userSlice.reducer;