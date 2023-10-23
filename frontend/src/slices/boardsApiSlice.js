import { apiSlice } from './apiSlice.js';
const USERS_URL = '/api/boards';

export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getall: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/`,
                method: 'GET',
                body: data,
            }),
        }),

    }),
});

export const {
    usegetallMutation,

} = userApiSlice;