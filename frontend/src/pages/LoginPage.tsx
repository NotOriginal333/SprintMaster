import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import {
  Container, Box, Typography, TextField, Button, Alert, Paper, Grid
} from '@mui/material';

import api from '../api/axios';
import { setCredentials } from '../store/authSlice';

export const LoginPage = () => {
  const { register, handleSubmit } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');

  const message = location.state?.message;

  const onSubmit = async (data: any) => {
    try {
      const response = await api.post('auth/token/', data);
      dispatch(setCredentials(response.data));
      navigate('/dashboard');
    } catch (err: any) {
      setError('Невірний логін або пароль');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper elevation={3} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          <Typography component="h1" variant="h5">
            Вхід в систему
          </Typography>

          {message && <Alert severity="success" sx={{ mt: 2, width: '100%' }}>{message}</Alert>}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1, width: '100%' }}>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <TextField
              margin="normal"
              required
              fullWidth
              label="Логін"
              autoFocus
              {...register('username')}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Пароль"
              type="password"
              {...register('password')}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Увійти
            </Button>

            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link to="/register" style={{ textDecoration: 'none', color: '#1976d2' }}>
                  {"Немає акаунту? Зареєструватися"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};