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

// Отримати спринти конкретного проєкту
export const fetchSprints = createAsyncThunk('sprints/fetchByProject', async (projectId: string) => {
    const response = await api.get(`sprints/?project=${projectId}`);
    return response.data.results || [];
});

// Створити спринт
export const createSprint = createAsyncThunk('sprints/create', async (data: any) => {
    const response = await api.post('sprints/', data);
    return response.data;
});

// Отримати таймлайн подій спринта
export const fetchSprintTimeline = createAsyncThunk(
    'sprints/fetchTimeline',
    async (sprintId: string) => {
        const response = await api.get(`sprints/${sprintId}/timeline/`);
        return response.data;
    }
);

// 👇 НОВЕ: Завершити спринт
export const completeSprint = createAsyncThunk(
    'sprints/complete',
    async (sprintId: number) => {
        const response = await api.post(`sprints/${sprintId}/complete/`);
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
            // Оновлюємо стан спринта на "неактивний" після завершення
            .addCase(completeSprint.fulfilled, (state, action) => {
                const sprint = state.list.find(s => s.id === action.meta.arg);
                if (sprint) {
                    sprint.is_active = false;
                }
            });
    },
});

export default sprintsSlice.reducer;