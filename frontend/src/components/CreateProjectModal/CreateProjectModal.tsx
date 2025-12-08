import React, {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {useDispatch, useSelector} from 'react-redux';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, Box, Alert, Select, MenuItem,
    InputLabel, FormControl, Checkbox, ListItemText, OutlinedInput
} from '@mui/material';
import type {AppDispatch, RootState} from '../../store';
import {createProject} from '../../store/projectsSlice';
import api from '../../api/axios';

interface CreateProjectModalProps {
    open: boolean;
    onClose: () => void;
}

interface FormData {
    name: string;
    description: string;
    start_date: string;
}

export const CreateProjectModal = ({open, onClose}: CreateProjectModalProps) => {
    const {register, handleSubmit, reset} = useForm<FormData>();
    const dispatch = useDispatch<AppDispatch>();
    const {user} = useSelector((state: RootState) => state.auth);

    const [error, setError] = useState<string | null>(null);

    // Для вибору учасників
    const [allUsers, setAllUsers] = useState<any[]>([]);
    const [selectedMembers, setSelectedMembers] = useState<number[]>([]);

    // Завантажуємо список усіх юзерів при відкритті
    useEffect(() => {
        if (open) {
            api.get('users/').then(res => {
                // Фільтруємо, щоб не показувати себе (менеджера) у списку вибору,
                // бо менеджер додається автоматично на бекенді/слайсі
                const others = (res.data.results || []).filter((u: any) => u.id !== user?.user_id);
                setAllUsers(others);
            });
            setSelectedMembers([]); // Скидаємо вибір
        }
    }, [open, user]);

    const onSubmit = async (data: FormData) => {
        if (!user) return;
        setError(null);

        try {
            await dispatch(createProject({
                ...data,
                manager: user.user_id || (user as any).id,
                members: selectedMembers // Відправляємо масив ID обраних людей
            })).unwrap();

            reset();
            onClose();
        } catch (err: any) {
            console.error("Failed to create project:", err);
            setError("Помилка створення. Перевірте дані.");
        }
    };

    const handleMemberChange = (event: any) => {
        const {target: {value}} = event;
        setSelectedMembers(typeof value === 'string' ? value.split(',') : value);
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Створити новий проєкт</DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent>
                    {error && <Alert severity="error" sx={{mb: 2}}>{error}</Alert>}

                    <Box display="flex" flexDirection="column" gap={3}>
                        <TextField
                            label="Назва проєкту"
                            fullWidth
                            required
                            {...register('name', {required: true})}
                        />

                        <TextField
                            label="Опис"
                            fullWidth
                            multiline
                            rows={3}
                            {...register('description')}
                        />

                        <TextField
                            label="Дата початку"
                            type="date"
                            fullWidth
                            required
                            InputLabelProps={{shrink: true}}
                            {...register('start_date', {required: true})}
                        />

                        {/* Вибір команди */}
                        <FormControl fullWidth>
                            <InputLabel>Команда (Учасники)</InputLabel>
                            <Select
                                multiple
                                value={selectedMembers}
                                onChange={handleMemberChange}
                                input={<OutlinedInput label="Команда (Учасники)"/>}
                                renderValue={(selected) => {
                                    // Показуємо імена вибраних
                                    return selected.map(id => {
                                        const u = allUsers.find(user => user.id === id);
                                        return u ? `${u.first_name} ${u.last_name}` : id;
                                    }).join(', ');
                                }}
                            >
                                {allUsers.map((u) => (
                                    <MenuItem key={u.id} value={u.id}>
                                        <Checkbox checked={selectedMembers.indexOf(u.id) > -1}/>
                                        <ListItemText primary={`${u.first_name} ${u.last_name} (@${u.username})`}
                                                      secondary={u.role}/>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
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