import React, {useEffect} from 'react';
import {useForm} from 'react-hook-form';
import {useDispatch} from 'react-redux';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, Box, MenuItem
} from '@mui/material';
import type {AppDispatch} from '../../store';
import {updateProject} from '../../store/projectsSlice';
import type {Project} from '../../types';

interface Props {
    open: boolean;
    onClose: () => void;
    project: Project;
}

export const EditProjectModal = ({open, onClose, project}: Props) => {
    const {register, handleSubmit, reset} = useForm();
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        if (project) {
            reset({
                name: project.name,
                description: project.description,
                status: project.status,
                start_date: project.start_date
            });
        }
    }, [project, reset]);

    const onSubmit = async (data: any) => {
        await dispatch(updateProject({id: project.id, data}));
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Налаштування проєкту</DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent>
                    <Box display="flex" flexDirection="column" gap={3}>
                        <TextField
                            label="Назва проєкту"
                            fullWidth
                            required
                            {...register('name', {required: true})}
                        />

                        <TextField
                            select
                            label="Статус"
                            fullWidth
                            defaultValue={project.status}
                            inputProps={register('status')}
                        >
                            <MenuItem value="ACTIVE">Активний</MenuItem>
                            <MenuItem value="ON_HOLD">Призупинено</MenuItem>
                            <MenuItem value="ARCHIVED">В архіві</MenuItem>
                        </TextField>

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
                            InputLabelProps={{shrink: true}}
                            {...register('start_date')}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Скасувати</Button>
                    <Button type="submit" variant="contained">Зберегти зміни</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};