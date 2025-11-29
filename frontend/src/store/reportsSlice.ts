import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import api from '../api/axios';
import type {Report} from '../types';

interface ReportsState {
    list: Report[];
    loading: boolean;
    error: string | null;
}

const initialState: ReportsState = {
    list: [],
    loading: false,
    error: null,
};

export const fetchReports = createAsyncThunk('reports/fetchReports', async () => {
    const response = await api.get('reports/');
    return response.data.results || [];
});

export const createReport = createAsyncThunk(
    'reports/createReport',
    async (data: { project: number; report_type: string }) => {
        const response = await api.post('reports/', data);
        return response.data;
    }
);

const reportsSlice = createSlice({
    name: 'reports',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchReports.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchReports.fulfilled, (state, action) => {
                state.loading = false;
                // Захист: гарантуємо, що це завжди масив
                state.list = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(fetchReports.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch reports';
            })
            .addCase(createReport.fulfilled, (state, action) => {
                if (!Array.isArray(state.list)) {
                    state.list = [];
                }
                state.list.unshift(action.payload);
            });
    },
});

export default reportsSlice.reducer;