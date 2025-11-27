import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container, Box, Typography, TextField, Button, Alert, Paper,
  Grid, MenuItem
} from '@mui/material';
import api from '../../api/axios';

export const RegisterPage = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const onSubmit = async (data: any) => {
    try {
      // Відправляємо запит на створення юзера
      // Бекенд поверне створеного юзера (status 201)
      await api.post('users/', data);

      // Якщо все ок - переходимо на логін
      navigate('/login');
    } catch (err: any) {
      console.error(err);
      // Якщо юзер з таким логіном вже є, бекенд поверне 400
      setError('Помилка реєстрації. Перевірте дані або спробуйте інший логін.');
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            Реєстрація
          </Typography>

          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField required fullWidth label="Ім'я" {...register('first_name')} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField required fullWidth label="Прізвище" {...register('last_name')} />
              </Grid>
              <Grid item xs={12}>
                <TextField required fullWidth label="Логін (Username)" {...register('username')} />
              </Grid>
              <Grid item xs={12}>
                <TextField required fullWidth label="Email" type="email" {...register('email')} />
              </Grid>
              <Grid item xs={12}>
                <TextField required fullWidth label="Пароль" type="password" {...register('password')} />
              </Grid>

              {/* Вибір ролі - важливо для курсової, щоб показати різні права */}
              <Grid item xs={12}>
                <TextField
                    select
                    fullWidth
                    label="Роль"
                    defaultValue="DEV"
                    inputProps={register('role')}
                >
                    <MenuItem value="PM">Project Manager</MenuItem>
                    <MenuItem value="DEV">Developer</MenuItem>
                    <MenuItem value="QA">QA Engineer</MenuItem>
                </TextField>
              </Grid>
            </Grid>

            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Зареєструватися
            </Button>

            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link to="/login" style={{ textDecoration: 'none', color: '#1976d2' }}>
                  Вже маєте акаунт? Увійти
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};