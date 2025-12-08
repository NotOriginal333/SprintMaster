import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
    Typography, Box, Paper, Table, TableBody, TableCell,
    TableHead, TableRow, Chip, LinearProgress, Tooltip
} from '@mui/material';
import {Warning as WarningIcon} from '@mui/icons-material';

import api from '../../api/axios';
import type {Task} from '../../types';
import type {RootState} from '../../store';
import {PriorityBadge} from './MyTasksPage.styles';
import {TaskModal} from '../../components/TaskModal/TaskModal'; // <--- Імпорт

export const MyTasksPage = () => {
    const {user} = useSelector((state: RootState) => state.auth);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(false);

    // Для відкриття деталей
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    useEffect(() => {
        const loadMyTasks = async () => {
            if (!user) return;
            setLoading(true);
            try {
                // Беремо задачі, призначені на мене
                const userId = user.user_id || (user as any).id;
                const response = await api.get(`tasks/?assignee=${userId}`);
                setTasks(response.data.results || []);
            } catch (e) {
                console.error("Error fetching my tasks", e);
            } finally {
                setLoading(false);
            }
        };

        loadMyTasks();
    }, [user]);

    return (
        <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>Мої задачі</Typography>

            {loading && <LinearProgress sx={{mb: 2}}/>}

            <Paper elevation={1}>
                <Table>
                    <TableHead>
                        <TableRow sx={{backgroundColor: '#f5f5f5'}}>
                            <TableCell>ID</TableCell>
                            <TableCell width="40%">Назва задачі</TableCell>
                            <TableCell>Статус</TableCell>
                            <TableCell>Пріоритет</TableCell>
                            <TableCell>SP</TableCell>
                            <TableCell align="center">Баги</TableCell> {/* Нова колонка */}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tasks.length === 0 && !loading ? (
                            <TableRow><TableCell colSpan={6} align="center">У вас немає активних
                                задач</TableCell></TableRow>
                        ) : (
                            tasks.map((task) => (
                                <TableRow
                                    key={task.id}
                                    hover
                                    sx={{cursor: 'pointer'}}
                                    onClick={() => setSelectedTask(task)} // <--- Відкриття модалки
                                >
                                    <TableCell color="text.secondary">#{task.id}</TableCell>
                                    <TableCell sx={{fontWeight: 500}}>{task.title}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={task.status.replace('_', ' ')}
                                            size="small"
                                            color={task.status === 'IN_PROGRESS' ? 'primary' : 'default'}
                                            variant={task.status === 'NEW' ? 'outlined' : 'filled'}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <PriorityBadge priority={task.priority}>
                                            {task.priority}
                                        </PriorityBadge>
                                    </TableCell>
                                    <TableCell>{task.story_points}</TableCell>

                                    {/* ІНДИКАТОР БАГІВ */}
                                    <TableCell align="center">
                                        {task.bugs && task.bugs.length > 0 ? (
                                            <Tooltip title={`${task.bugs.length} активних помилок`}>
                                                <Chip
                                                    icon={<WarningIcon sx={{fontSize: '1rem !important'}}/>}
                                                    label={task.bugs.length}
                                                    color="error"
                                                    size="small"
                                                    sx={{height: 24, px: 0.5}}
                                                />
                                            </Tooltip>
                                        ) : (
                                            <Typography variant="caption" color="text.disabled">-</Typography>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </Paper>

            {/* МОДАЛКА ЗАДАЧІ (з якої можна відкрити і баги) */}
            <TaskModal
                open={Boolean(selectedTask)}
                onClose={() => setSelectedTask(null)}
                task={selectedTask}
            />
        </Box>
    );
};