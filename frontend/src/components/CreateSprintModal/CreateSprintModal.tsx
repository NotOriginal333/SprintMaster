import React from 'react';
import {useForm} from 'react-hook-form';
import {useDispatch} from 'react-redux';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
    Checkbox,
    FormControlLabel
} from '@mui/material';
import type {AppDispatch} from '../../store';
import {createSprint} from '../../store/sprintsSlice';

interface Props {
    open: boolean;
    onClose: () => void;
    projectId: string;
}

export const CreateSprintModal = ({open, onClose, projectId}: Props) => {
    const {register, handleSubmit, reset} = useForm();
    const dispatch = useDispatch<AppDispatch>();

    const onSubmit = async (data: any) => {
        await dispatch(createSprint({
            ...data,
            project: Number(projectId)
        }));
        reset();
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Планування спринта</DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent>
                    <Box display="flex" flexDirection="column" gap={2}>
                        <TextField label="Назва спринта" required {...register('name')} />
                        <TextField label="Ціль спринта" multiline rows={2} {...register('goal')} />

                        <Box display="flex" gap={2}>
                            <TextField label="Початок" type="date" fullWidth InputLabelProps={{shrink: true}}
                                       required {...register('start_date')} />
                            <TextField label="Кінець" type="date" fullWidth InputLabelProps={{shrink: true}}
                                       required {...register('end_date')} />
                        </Box>

                        <FormControlLabel
                            control={<Checkbox defaultChecked {...register('is_active')} />}
                            label="Зробити активним"
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