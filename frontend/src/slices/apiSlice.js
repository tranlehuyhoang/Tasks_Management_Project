import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({ baseUrl: 'https://kanban-servers.onrender.com/' });

export const apiSlice = createApi({
    baseQuery,
    tagTypes: ['User'],
    credentials: 'include',
    endpoints: (builder) => ({}),
});