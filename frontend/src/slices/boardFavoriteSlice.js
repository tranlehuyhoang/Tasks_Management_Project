import { createSlice } from '@reduxjs/toolkit';

const initialState = { value: [] }

const boardFavoriteSlice = createSlice({
    name: 'favorite',
    initialState,
    reducers: {
        setFavoriteList: (state, action) => {
            state.value = action.payload
        },
    },
});

export const { setFavoriteList } = boardFavoriteSlice.actions;

export default boardFavoriteSlice.reducer;