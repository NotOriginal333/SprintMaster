import React from 'react';
import {useForm} from 'react-hook-form';
import {useDispatch} from 'react-redux';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, Box, MenuItem, Alert
} from '@mui/material';
import type {AppDispatch} from '../../store';
import {createBugReport} from '../../store/bugsSlice';

interface Props {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void; // <--- НОВИЙ ПРОП
    projectId: number;
    taskId: number;
    taskTitle: string;
}

export const ReportBugModal = ({open, onClose, onSuccess, projectId, taskId, taskTitle}: Props) => {
    const {register, handleSubmit, reset} = useForm();
    const dispatch = useDispatch<AppDispatch>();

    const onSubmit = async (data: any) => {
        try {
            await dispatch(createBugReport({
                ...data,
                project: projectId,
                task: taskId,
                status: 'NEW'
            })).unwrap();

            reset();
            onClose();     // Закриваємо модалку
            onSuccess();   // <--- Сигналимо про успіх (замість alert)
        } catch (e) {
            console.error("Failed to report bug", e);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{color: '#d32f2f', fontWeight: 'bold'}}>
                Звіт про помилку (Bug Report)
            </DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent>
                    <Box mb={2}>
                        <Alert severity="info">
                            Баг буде прив'язано до задачі: <strong>{taskTitle}</strong>
                        </Alert>
                    </Box>

                    <Box display="flex" flexDirection="column" gap={2}>
                        <TextField
                            label="Суть помилки (Title)"
                            required
                            color="error"
                            {...register('title')}
                        />

                        <TextField
                            label="Детальний опис"
                            multiline
                            rows={4}
                            color="error"
                            required
                            {...register('description')}
                        />

                        <TextField
                            select
                            label="Пріоритет"
                            defaultValue="HIGH"
                            color="error"
                            inputProps={register('priority')}
                        >
                            <MenuItem value="LOW">Low</MenuItem>
                            <MenuItem value="MEDIUM">Medium</MenuItem>
                            <MenuItem value="HIGH">High</MenuItem>
                            <MenuItem value="CRITICAL">Critical</MenuItem>
                        </TextField>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Скасувати</Button>
                    <Button type="submit" variant="contained" color="error">
                        Створити баг
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};