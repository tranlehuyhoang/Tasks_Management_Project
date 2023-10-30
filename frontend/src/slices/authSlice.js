import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
const initialState = {
    userInfo: localStorage.getItem('userInfo')
        ? JSON.parse(localStorage.getItem('userInfo'))
        : null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            state.userInfo = action.payload;
            localStorage.setItem('userInfo', JSON.stringify(action.payload));
            const token = action.payload.token;
            Cookies.set('jwt1', token, {
                expires: 30, // Expires in 30 days
                secure: true, // Use secure cookies in production
                sameSite: 'strict', // Prevent CSRF attacks
            });
            console.log(token);
        },
    },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;