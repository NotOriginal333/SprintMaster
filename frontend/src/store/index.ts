import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import projectsReducer from './projectsSlice';
import reportsReducer from './reportsSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        projects: projectsReducer,
        reports: reportsReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;