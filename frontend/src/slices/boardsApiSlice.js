import { useParams } from 'react-router';
import { apiSlice } from './apiSlice.js';
const BOARDS_URL = '/api/boards';

export const boardApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createBoard: builder.mutation({
            query: (data) => ({
                url: `${BOARDS_URL}/`,
                method: 'POST',
                body: data,
            }),
        }),
        getAll: builder.mutation({
            query: () => ({
                url: `${BOARDS_URL}/`,
                method: 'GET',
            }),
        }),
        updatePosition: builder.mutation({
            query: (data) => ({
                url: `${BOARDS_URL}/`,
                method: 'PUT',
                body: data,
            }),
        }),
        getFavourites: builder.mutation({
            query: (data) => ({
                url: `${BOARDS_URL}/favourites`,
                method: 'GET',
                body: data,
            }),
        }),
        updateFavouritePosition: builder.mutation({
            query: (data) => ({
                url: `${BOARDS_URL}/favourites`,
                method: 'PUT',
                body: data,
            }),
        }),
        getOne: builder.mutation({
            query: (data) => ({
                url: `${BOARDS_URL}/${data}`,
                method: 'GET',

            }),
        }),
        update: builder.mutation({
            query: (data) => ({

                url: `${BOARDS_URL}/${data.boardId}`,
                method: 'PUT',
                body: data,
            }),
        }),
        deleteBoard: builder.mutation({
            query: (data) => ({
                url: `${BOARDS_URL}/${data}`,
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
    usegetFavouritesMutation,
    useupdateFavouritePositionMutation,
    useGetOneMutation,
    useUpdateMutation,
    usedeleteBoardMutation,

} = boardApiSlice;