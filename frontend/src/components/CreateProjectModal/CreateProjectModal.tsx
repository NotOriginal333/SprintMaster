import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Box
} from '@mui/material';
import type { AppDispatch, RootState } from '../../store';
import { createProject } from '../../store/projectsSlice';

interface CreateProjectModalProps {
  open: boolean;
  onClose: () => void;
}

interface FormData {
  name: string;
  description: string;
  start_date: string;
}

export const CreateProjectModal = ({ open, onClose }: CreateProjectModalProps) => {
  const { register, handleSubmit, reset } = useForm<FormData>();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  const onSubmit = async (data: FormData) => {
    if (!user) return;

    // Відправляємо дані на Redux -> API
    await dispatch(createProject({
        ...data,
        manager: user.user_id, // Менеджером стає той, хто створює
    }));

    reset(); // Очистити форму
    onClose(); // Закрити вікно
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Створити новий проєкт</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={3}>
            <TextField
              label="Назва проєкту"
              fullWidth
              required
              {...register('name', { required: true })}
            />

            <TextField
              label="Опис"
              fullWidth
              multiline
              rows={4}
              {...register('description')}
            />

            <TextField
              label="Дата початку"
              type="date"
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
              {...register('start_date', { required: true })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Скасувати</Button>
          <Button type="submit" variant="contained">Створити</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};