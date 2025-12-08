import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import api from '../api/axios';

interface Sprint {
    id: number;
    name: string;
    goal: string;
    start_date: string;
    end_date: string;
    is_active: boolean;
    project: number;
}

interface SprintsState {
    list: Sprint[];
    loading: boolean;
}

const initialState: SprintsState = {
    list: [],
    loading: false,
};

export const fetchSprints = createAsyncThunk('sprints/fetchByProject', async (projectId: string) => {
    const response = await api.get(`sprints/?project=${projectId}`);
    return response.data.results || [];
});

export const createSprint = createAsyncThunk('sprints/create', async (data: any) => {
    const response = await api.post('sprints/', data);
    return response.data;
});

export const fetchSprintTimeline = createAsyncThunk('sprints/fetchTimeline', async (sprintId: string) => {
    const response = await api.get(`sprints/${sprintId}/timeline/`);
    return response.data;
});

export const completeSprint = createAsyncThunk('sprints/complete', async (sprintId: number) => {
    const response = await api.post(`sprints/${sprintId}/complete/`);
    return response.data;
});

// 👇 НОВЕ: Оновлення спринта
export const updateSprint = createAsyncThunk(
    'sprints/update',
    async ({id, data}: { id: number, data: any }) => {
        const response = await api.patch(`sprints/${id}/`, data);
        return response.data;
    }
);

const sprintsSlice = createSlice({
    name: 'sprints',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSprints.fulfilled, (state, action) => {
                state.list = action.payload;
            })
            .addCase(createSprint.fulfilled, (state, action) => {
                state.list.unshift(action.payload);
            })
            .addCase(completeSprint.fulfilled, (state, action) => {
                const sprint = state.list.find(s => s.id === action.meta.arg);
                if (sprint) sprint.is_active = false;
            })
            // Обробка оновлення
            .addCase(updateSprint.fulfilled, (state, action) => {
                const index = state.list.findIndex(s => s.id === action.payload.id);
                if (index !== -1) state.list[index] = action.payload;
            });
    },
});

export default sprintsSlice.reducer;