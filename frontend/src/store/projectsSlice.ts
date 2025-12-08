import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import api from '../api/axios';
import type {Project} from '../types';

interface ProjectsState {
    list: Project[];
    currentProject: Project | null;
    loading: boolean;
}

const initialState: ProjectsState = {
    list: [],
    currentProject: null,
    loading: false,
};

export const fetchProjects = createAsyncThunk('projects/fetchAll', async () => {
    const response = await api.get('projects/');
    return response.data.results;
});

export const fetchProjectById = createAsyncThunk('projects/fetchOne', async (id: string) => {
    const response = await api.get(`projects/${id}/`);
    return response.data;
});

export const createProject = createAsyncThunk(
    'projects/create',
    async (data: { name: string; description: string; start_date: string; manager: number; members?: number[] }) => {
        const response = await api.post('projects/', data);
        return response.data;
    }
);

export const updateProject = createAsyncThunk(
    'projects/update',
    async ({id, data}: { id: number, data: any }) => {
        const response = await api.patch(`projects/${id}/`, data);
        return response.data;
    }
);

export const deleteProject = createAsyncThunk('projects/delete', async (id: number) => {
    await api.delete(`projects/${id}/`);
    return id;
});

export const addMemberToProject = createAsyncThunk(
    'projects/addMember',
    async ({projectId, memberIds}: { projectId: number, memberIds: number[] }) => {
        const response = await api.patch(`projects/${projectId}/`, {members: memberIds});
        return response.data;
    }
);

const projectsSlice = createSlice({
    name: 'projects',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProjects.fulfilled, (state, action) => {
                state.list = action.payload;
            })
            .addCase(fetchProjectById.fulfilled, (state, action) => {
                state.currentProject = action.payload;
            })
            .addCase(createProject.fulfilled, (state, action) => {
                state.list.unshift(action.payload);
            })
            .addCase(updateProject.fulfilled, (state, action) => {
                if (state.currentProject && state.currentProject.id === action.payload.id) {
                    state.currentProject = action.payload;
                }
                const index = state.list.findIndex(p => p.id === action.payload.id);
                if (index !== -1) state.list[index] = action.payload;
            })
            .addCase(addMemberToProject.fulfilled, (state, action) => {
                if (state.currentProject && state.currentProject.id === action.payload.id) {
                    state.currentProject = action.payload;
                }
            })
            .addCase(deleteProject.fulfilled, (state, action) => {
                state.list = state.list.filter(p => p.id !== action.payload);
                if (state.currentProject?.id === action.payload) {
                    state.currentProject = null;
                }
            });
    },
});

export default projectsSlice.reducer;