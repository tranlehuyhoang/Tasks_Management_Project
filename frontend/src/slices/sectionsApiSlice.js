import { apiSlice } from './apiSlice.js';
const SECTIONS_URL = 'https://kanban-servers.onrender.com/api/sections';

const token = localStorage.getItem('token');
export const sectionApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createSection: builder.mutation({
            query: (data) => ({
                url: `${SECTIONS_URL}/${data}?token=${token}`,
                method: 'POST',
                body: data,
            }),
        }),
        updateSection: builder.mutation({
            query: (data) => ({
                url: `${SECTIONS_URL}/${data.sectionId}?token=${token}`,
                method: 'PUT',
            }),
        }),
        deleteSection: builder.mutation({
            query: (data) => ({
                url: `${SECTIONS_URL}/${data.sectionId}?token=${token}`,
                method: 'DELETE',
                body: data,
            }),
        }),

    }),
});

export const {
    useCreateSectionMutation,
    useUpdateSectionMutation,
    useDeleteSectionMutation


} = sectionApiSlice;