import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';

interface User {
    user_id: number;
    role?: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
}

const token = localStorage.getItem('access_token');
let user: User | null = null;

if (token) {
    try {
        user = jwtDecode(token);
    } catch {
        localStorage.clear();
    }
}

const initialState: AuthState = {
    user: user,
    token: token,
    isAuthenticated: !!token, // true якщо токен є
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<{ access: string; refresh: string }>) => {
            const { access, refresh } = action.payload;
            state.token = access;
            state.isAuthenticated = true;
            state.user = jwtDecode(access);

            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh);
        },
        logout: (state) => {
            state.token = null;
            state.user = null;
            state.isAuthenticated = false;
            localStorage.clear();
        },
    },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;