import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
    baseUrl: '',
    prepareHeaders: (headers, { getState }) => {
        // Thêm sameSite vào header
        headers.set('sameSite', 'none');
        return headers;
    },
});
export const apiSlice = createApi({
    baseQuery,
    tagTypes: ['User'],
    sameSite: "none",
    credentials: 'include',
    endpoints: (builder) => ({}),
});