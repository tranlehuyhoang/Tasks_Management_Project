import { createSlice } from '@reduxjs/toolkit';

const initialState = { value: [] }

const boardSlice = createSlice({
    name: 'board',
    initialState,
    reducers: {
        setBoards: (state, action) => {
            state.value = action.payload
        },

    },
});

export const { setBoards } = boardSlice.actions;

export default boardSlice.reducer;