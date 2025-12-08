import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

interface CreateBugPayload {
    title: string;
    description: string;
    priority: string;
    project: number;
    task?: number;
}
interface BugsState {
    loading: boolean;
}

const initialState: BugsState = {
    loading: false,
};

export const createBugReport = createAsyncThunk(
    'bugs/create',
    async (data: any) => { // (Тут можна залишити any або CreateBugPayload)
        const response = await api.post('bugs/', data);
        return response.data;
    }
);

export const updateBugStatus = createAsyncThunk(
    'bugs/updateStatus',
    async ({ id, status }: { id: number, status: string }) => {
        const response = await api.patch(`bugs/${id}/`, { status });
        return response.data;
    }
);

const bugsSlice = createSlice({
    name: 'bugs',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createBugReport.pending, (state) => { state.loading = true; })
            .addCase(createBugReport.fulfilled, (state) => { state.loading = false; })
            .addCase(createBugReport.rejected, (state) => { state.loading = false; })
            .addCase(updateBugStatus.fulfilled, (state) => { state.loading = false; });
    },
});

export default bugsSlice.reducer;