import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
    Typography, Box, Paper, Table, TableBody, TableCell,
    TableHead, LinearProgress, Tooltip, Chip,
    InputLabel, InputAdornment, MenuItem, Select
} from '@mui/material';
import {Search as SearchIcon, FilterList as FilterIcon} from '@mui/icons-material';

import api from '../../api/axios';
import type {Task} from '../../types';
import type {RootState} from '../../store';
import {TaskModal} from '../../components/TaskModal/TaskModal';

import {
    FilterPaper, SearchField, StatusControl,
    TableHeaderRow, ClickableTableRow, PriorityBadge,
    DueDateText, BugChip, SmallWarningIcon
} from './MyTasksPage.styles';

export const MyTasksPage = () => {
    const {user} = useSelector((state: RootState) => state.auth);

    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('all');

    const loadMyTasks = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const userId = user.user_id || (user as any).id;
            const params = new URLSearchParams();
            params.append('assignee', userId);
            if (search) params.append('search', search);
            if (status !== 'all') params.append('status', status);

            const response = await api.get(`tasks/?${params.toString()}`);
            setTasks(response.data.results || []);
        } catch (e) {
            console.error("Error fetching my tasks", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            loadMyTasks();
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [user, search, status]);

    return (
        <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>Мої задачі</Typography>

            {/* Фільтри винесені в стилізований компонент */}
            <FilterPaper elevation={1}>
                <SearchField
                    label="Пошук задачі..."
                    variant="outlined"
                    size="small"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    InputProps={{
                        startAdornment: <InputAdornment position="start"><SearchIcon/></InputAdornment>,
                    }}
                />

                <StatusControl size="small">
                    <InputLabel>Статус</InputLabel>
                    <Select
                        value={status}
                        label="Статус"
                        onChange={(e) => setStatus(e.target.value)}
                        startAdornment={<InputAdornment position="start"><FilterIcon/></InputAdornment>}
                    >
                        <MenuItem value="all">Всі статуси</MenuItem>
                        <MenuItem value="NEW">To Do</MenuItem>
                        <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                        <MenuItem value="REVIEW">Code Review</MenuItem>
                        <MenuItem value="TESTING">Testing</MenuItem>
                        <MenuItem value="DONE">Done</MenuItem>
                    </Select>
                </StatusControl>
            </FilterPaper>

            {loading && <LinearProgress sx={{mb: 2}}/>}

            <Paper elevation={1}>
                <Table>
                    <TableHead>
                        <TableHeaderRow>
                            <TableCell>ID</TableCell>
                            <TableCell width="30%">Назва задачі</TableCell>
                            <TableCell>Статус</TableCell>
                            <TableCell>Пріоритет</TableCell>
                            <TableCell>SP</TableCell>
                            <TableCell>Дедлайн</TableCell>
                            <TableCell align="center">Баги</TableCell>
                        </TableHeaderRow>
                    </TableHead>
                    <TableBody>
                        {tasks.length === 0 && !loading ? (
                            <TableHeaderRow>
                                <TableCell colSpan={7} align="center">Задач не знайдено</TableCell>
                            </TableHeaderRow>
                        ) : (
                            tasks.map((task) => {
                                // Логіка перевірки прострочення
                                const isOverdue = task.due_date
                                    ? new Date(task.due_date) < new Date() && task.status !== 'DONE' && task.status !== 'CLOSED'
                                    : false;

                                return (
                                    <ClickableTableRow
                                        key={task.id}
                                        hover
                                        onClick={() => setSelectedTask(task)}
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

                                        <TableCell>
                                            {task.due_date ? (
                                                <DueDateText isOverdue={isOverdue}>
                                                    {task.due_date}
                                                </DueDateText>
                                            ) : '-'}
                                        </TableCell>

                                        <TableCell align="center">
                                            {task.bugs && task.bugs.length > 0 ? (
                                                <Tooltip title={`${task.bugs.length} активних помилок`}>
                                                    <BugChip
                                                        icon={<SmallWarningIcon/>}
                                                        label={task.bugs.length}
                                                        color="error"
                                                        size="small"
                                                    />
                                                </Tooltip>
                                            ) : (
                                                <Typography variant="caption" color="text.disabled">-</Typography>
                                            )}
                                        </TableCell>
                                    </ClickableTableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </Paper>

            <TaskModal
                open={Boolean(selectedTask)}
                onClose={() => {
                    setSelectedTask(null);
                    loadMyTasks();
                }}
                task={selectedTask}
            />
        </Box>
    );
};