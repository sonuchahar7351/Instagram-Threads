import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    screen: 'login', // Default screen
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuthScreen(state, action) {
            state.screen = action.payload; // Update the screen state
        },
    },
});

// Export the action creator
export const { setAuthScreen } = authSlice.actions;

// Export the reducer
export default authSlice.reducer;