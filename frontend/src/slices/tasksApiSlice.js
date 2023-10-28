import { apiSlice } from './apiSlice.js';
const TASKS_URL = '/api/tasks';

export const tasksApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createTask: builder.mutation({
            query: (data) => ({
                url: `${TASKS_URL}/`,
                method: 'POST',
                body: data,
            }),
        }),
        updateTask: builder.mutation({
            query: (data) => ({
                url: `${TASKS_URL}/${data.taskId}`,
                method: 'PUT',
                body: data,
            }),
        }),
        deleteTask: builder.mutation({
            query: (data) => ({
                url: `${TASKS_URL}/${data.taskId}`,
                method: 'DELETE',
                body: data,
            }),
        }),
        updatePositionTask: builder.mutation({
            query: (data) => ({
                url: `${TASKS_URL}/update-position`,
                method: 'PUT',
                body: data,
            }),
        }),

    }),
});

export const {
    useCreateTaskMutation,
    useUpdateTaskMutation,
    useDeleteTaskMutation,
    useUpdatePositionTaskMutation


} = tasksApiSlice;