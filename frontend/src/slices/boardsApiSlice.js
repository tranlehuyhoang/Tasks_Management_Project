import { useParams } from 'react-router';
import { apiSlice } from './apiSlice.js';
const BOARDS_URL = 'https://kanban-servers.onrender.com/api/boards';

const token = localStorage.getItem('token');
export const boardApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createBoard: builder.mutation({
            query: (data) => ({
                url: `${BOARDS_URL}/?token=${token}`,
                method: 'POST',
                body: data,
            }),
        }),
        getAll: builder.mutation({
            query: () => ({
                url: `${BOARDS_URL}/?token=${token}`,
                method: 'GET',
            }),
        }),
        updatePosition: builder.mutation({
            query: (data) => ({
                url: `${BOARDS_URL}/?token=${token}`,
                method: 'PUT',
                body: data,
            }),
        }),
        getFavourites: builder.mutation({
            query: () => ({
                url: `${BOARDS_URL}/favourites?token=${token}`,
                method: 'GET',

            }),
        }),
        updateFavouritePosition: builder.mutation({
            query: (data) => ({
                url: `${BOARDS_URL}/favourites?token=${token}`,
                method: 'PUT',
                body: data,
            }),
        }),
        getOne: builder.mutation({
            query: (data) => ({
                url: `${BOARDS_URL}/${data}?token=${token}`,
                method: 'GET',

            }),
        }),
        update: builder.mutation({
            query: (data) => ({

                url: `${BOARDS_URL}/${data.boardId}?token=${token}`,
                method: 'PUT',
                body: data,
            }),
        }),
        deleteBoard: builder.mutation({
            query: (data) => ({
                url: `${BOARDS_URL}/${data}?token=${token}`,
                method: 'DELETE',
                body: data,
            }),
        }),
    }),
});

export const {
    useCreateBoardMutation,
    useGetAllMutation,
    useUpdatePositionMutation,
    useGetFavouritesMutation,
    useUpdateFavouritePositionMutation,
    useGetOneMutation,
    useUpdateMutation,
    useDeleteBoardMutation,

} = boardApiSlice;