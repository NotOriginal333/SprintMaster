import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import api from '../api/axios';
import type {Task} from '../types';

interface TasksState {
    list: Task[];
    loading: boolean;
}

const initialState: TasksState = {
    list: [],
    loading: false,
};

export const fetchTasks = createAsyncThunk('tasks/fetchByProject', async (projectId: string) => {
    const response = await api.get(`tasks/?project=${projectId}`);
    return response.data.results || [];
});

export const createTask = createAsyncThunk('tasks/create', async (data: any) => {
    const response = await api.post('tasks/', data);
    return response.data;
});

export const updateTask = createAsyncThunk('tasks/update', async ({id, data}: { id: number, data: any }) => {
    const response = await api.patch(`tasks/${id}/`, data);
    return response.data;
});

export const deleteTask = createAsyncThunk('tasks/delete', async (id: number) => {
    await api.delete(`tasks/${id}/`);
    return id;
});

const tasksSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state.list = action.payload;
            })
            .addCase(createTask.fulfilled, (state, action) => {
                state.list.push(action.payload);
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                const index = state.list.findIndex(t => t.id === action.payload.id);
                if (index !== -1) state.list[index] = action.payload;
            })
            .addCase(deleteTask.fulfilled, (state, action) => {
                state.list = state.list.filter(t => t.id !== action.payload);
            });
    },
});

export default tasksSlice.reducer;