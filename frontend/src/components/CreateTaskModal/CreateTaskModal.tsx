import React from 'react';
import {useForm} from 'react-hook-form';
import {useDispatch, useSelector} from 'react-redux';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button,
    Box, MenuItem
} from '@mui/material';
import type {AppDispatch, RootState} from '../../store';
import {createTask} from '../../store/tasksSlice';

interface Props {
    open: boolean;
    onClose: () => void;
    projectId: string;
    sprintId?: number; // Це буде дефолтне значення
}

export const CreateTaskModal = ({open, onClose, projectId, sprintId}: Props) => {
    const {register, handleSubmit, reset} = useForm();
    const dispatch = useDispatch<AppDispatch>();

    // Дістаємо дані з Redux
    const {currentProject} = useSelector((state: RootState) => state.projects);
    const {list: sprints} = useSelector((state: RootState) => state.sprints);

    const onSubmit = async (data: any) => {
        // Якщо вибрано пустий рядок -> null (Backlog)
        const finalSprintId = data.sprint ? Number(data.sprint) : null;

        await dispatch(createTask({
            ...data,
            project: Number(projectId),
            sprint: finalSprintId,
            status: 'NEW'
        }));
        reset();
        onClose();
    };

    // Формуємо список виконавців
    const assignees = currentProject ? [
        currentProject.manager_details,
        ...(currentProject.members_details || [])
    ].filter(Boolean) : [];

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Створити задачу</DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent>
                    <Box display="flex" flexDirection="column" gap={2}>
                        {/* Вибір Спринта */}
                        <TextField
                            select
                            label="Спринт"
                            fullWidth
                            defaultValue={sprintId || ""}
                            inputProps={register('sprint')}
                            helperText="Залиште пустим, щоб додати в Backlog"
                        >
                            <MenuItem value=""><em>Backlog (Без спринта)</em></MenuItem>
                            {sprints.map(s => (
                                <MenuItem key={s.id} value={s.id}>
                                    {s.name} {s.is_active ? '(Active)' : ''}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField label="Заголовок" required {...register('title')} />
                        <TextField label="Опис" multiline rows={3} {...register('description')} />

                        <Box display="flex" gap={2}>
                            <TextField select label="Пріоритет" fullWidth defaultValue="MEDIUM"
                                       inputProps={register('priority')}>
                                <MenuItem value="LOW">Low</MenuItem>
                                <MenuItem value="MEDIUM">Medium</MenuItem>
                                <MenuItem value="HIGH">High</MenuItem>
                                <MenuItem value="CRITICAL">Critical</MenuItem>
                            </TextField>

                            <TextField select label="Story Points" fullWidth defaultValue={1}
                                       inputProps={register('story_points')}>
                                {[1, 2, 3, 5, 8, 13, 21].map(sp => (
                                    <MenuItem key={sp} value={sp}>{sp} SP</MenuItem>
                                ))}
                            </TextField>
                        </Box>

                        <TextField select label="Виконавець" fullWidth defaultValue=""
                                   inputProps={register('assignee')}>
                            <MenuItem value="">Unassigned</MenuItem>
                            {assignees.map((u: any) => (
                                <MenuItem key={u.id} value={u.id}>
                                    {u.first_name} {u.last_name} ({u.role})
                                </MenuItem>
                            ))}
                        </TextField>
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