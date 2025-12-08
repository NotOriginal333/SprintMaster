import React, {useEffect, useState} from 'react';
import {useForm, Controller} from 'react-hook-form';
import {useDispatch, useSelector} from 'react-redux';
import {
    DialogContent, DialogActions, Button, Typography,
    Select, MenuItem, FormControl, InputLabel, TextField,
    Avatar, Stack, Box, Divider, Alert, Snackbar,
    List, ListItem, ListItemIcon, ListItemText, ListItemButton
} from '@mui/material';
import {BugReport as BugIcon, Save as SaveIcon, Warning as WarningIcon, CheckCircle} from '@mui/icons-material';

import {StyledDialog, HeaderBox} from './TaskModal.styles';
import {RoleGuard} from '../../utils/rbac';
import type {AppDispatch, RootState} from '../../store';
import type {Task, BugReport} from '../../types';
import {updateTask, fetchTasks} from '../../store/tasksSlice';
import api from '../../api/axios';

import {ReportBugModal} from '../ReportBugModal/ReportBugModal';
import {BugDetailsModal} from '../BugDetailsModal/BugDetailsModal';

interface TaskModalProps {
    open: boolean;
    onClose: () => void;
    task: Task | null;
}

export const TaskModal = ({open, onClose, task}: TaskModalProps) => {
    const dispatch = useDispatch<AppDispatch>();
    const {user} = useSelector((state: RootState) => state.auth);
    const {list: sprints} = useSelector((state: RootState) => state.sprints);

    const {control, handleSubmit, reset, register} = useForm();

    const [users, setUsers] = useState<any[]>([]);
    const [successMsg, setSuccessMsg] = useState('');

    const [isBugModalOpen, setBugModalOpen] = useState(false);
    const [selectedBug, setSelectedBug] = useState<BugReport | null>(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const isPM = user?.role === 'PM' || user?.role === 'ADMIN';
    const isDev = user?.role === 'DEV';
    const isQA = user?.role === 'QA';

    useEffect(() => {
        if (open && isPM) {
            api.get('users/').then(res => setUsers(res.data.results || []));
        }
    }, [open, isPM]);

    useEffect(() => {
        if (task) {
            reset({
                title: task.title,
                description: task.description,
                status: task.status,
                priority: task.priority,
                story_points: task.story_points,
                assignee: task.assignee || "",
                sprint: task.sprint || ""
            });
            setSuccessMsg('');
        }
    }, [task, reset]);

    const onSubmit = async (data: any) => {
        if (!task) return;
        const payload: any = {};

        if (isPM) {
            Object.assign(payload, data);
            if (payload.assignee === "") payload.assignee = null;
            if (payload.sprint === "") payload.sprint = null;
        } else if (isDev) {
            payload.status = data.status;
        }

        try {
            await dispatch(updateTask({id: task.id, data: payload})).unwrap();
            setSuccessMsg('Зміни збережено!');
            setTimeout(() => {
                onClose();
                setSuccessMsg('');
            }, 1000);
        } catch (e) {
            console.error("Failed to update task", e);
        }
    };

    const handleBugSuccess = () => {
        setSnackbarOpen(true);
        if (task) dispatch(fetchTasks(task.project.toString()));
    };

    const handleBugUpdate = () => {
        if (task) dispatch(fetchTasks(task.project.toString()));
    };

    if (!task) return null;

    return (
        <>
            <StyledDialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogContent>
                        <HeaderBox>
                            <Box sx={{flexGrow: 1, mr: 2}}>
                                <Typography variant="caption" color="text.secondary">TASK-{task.id}</Typography>
                                {isPM ? (
                                    <TextField
                                        fullWidth
                                        variant="standard"
                                        {...register('title')}
                                        inputProps={{style: {fontSize: '1.5rem', fontWeight: 'bold'}}}
                                    />
                                ) : (
                                    <Typography variant="h5" fontWeight="bold" sx={{wordBreak: 'break-word'}}>
                                        {task.title}
                                    </Typography>
                                )}
                            </Box>

                            <RoleGuard allowedRoles={['QA']}>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    size="small"
                                    startIcon={<BugIcon/>}
                                    onClick={() => setBugModalOpen(true)}
                                    sx={{whiteSpace: 'nowrap', minWidth: '130px', height: 'fit-content'}}
                                >
                                    Report Bug
                                </Button>
                            </RoleGuard>
                        </HeaderBox>

                        {successMsg && <Alert severity="success" sx={{mb: 2}}>{successMsg}</Alert>}

                        <Box sx={{my: 2}}>
                            {isPM ? (
                                <TextField label="Опис" fullWidth multiline rows={3} {...register('description')} />
                            ) : (
                                <Typography variant="body1" sx={{
                                    whiteSpace: 'pre-wrap',
                                    color: task.description ? 'text.primary' : 'text.disabled'
                                }}>
                                    {task.description || "Опис відсутній"}
                                </Typography>
                            )}
                        </Box>

                        <Divider sx={{my: 2}}/>

                        <Typography variant="caption" color="text.secondary"
                                    sx={{mb: 1, display: 'block'}}>ПЛАНУВАННЯ</Typography>
                        <FormControl fullWidth size="small" sx={{mb: 3}}>
                            <InputLabel shrink>Спринт</InputLabel> {/* Shrink fix */}
                            <Controller
                                name="sprint"
                                control={control}
                                render={({field}) => (
                                    <Select
                                        {...field} label="Спринт" displayEmpty disabled={!isPM}
                                        renderValue={(selected) => {
                                            if (selected === "" || selected === null) return <em
                                                style={{color: 'gray'}}>Backlog</em>;
                                            const sprint = sprints.find(s => s.id === selected);
                                            return sprint ? `${sprint.name} ${sprint.is_active ? '(Active)' : ''}` : selected;
                                        }}
                                    >
                                        <MenuItem value=""><em>Backlog</em></MenuItem>
                                        {sprints.map(s => <MenuItem key={s.id}
                                                                    value={s.id}>{s.name} {s.is_active ? '(Active)' : ''}</MenuItem>)}
                                    </Select>
                                )}
                            />
                        </FormControl>

                        <Stack direction="row" spacing={2} sx={{mb: 3}}>
                            <FormControl fullWidth size="small">
                                <InputLabel shrink>Статус</InputLabel> {/* Shrink fix */}
                                <Controller
                                    name="status"
                                    control={control}
                                    render={({field}) => (
                                        <Select {...field} label="Статус" disabled={!isPM && !isDev}>
                                            <MenuItem value="NEW">To Do</MenuItem>
                                            <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                                            <MenuItem value="REVIEW">Code Review</MenuItem>
                                            <MenuItem value="TESTING">Testing</MenuItem>
                                            <MenuItem value="DONE">Done</MenuItem>
                                        </Select>
                                    )}
                                />
                            </FormControl>
                            <FormControl fullWidth size="small">
                                <InputLabel shrink>Priority</InputLabel> {/* Shrink fix */}
                                <Controller
                                    name="priority"
                                    control={control}
                                    render={({field}) => (
                                        <Select {...field} label="Priority" disabled={!isPM}>
                                            <MenuItem value="LOW">Low</MenuItem>
                                            <MenuItem value="MEDIUM">Medium</MenuItem>
                                            <MenuItem value="HIGH">High</MenuItem>
                                            <MenuItem value="CRITICAL">Critical</MenuItem>
                                        </Select>
                                    )}
                                />
                            </FormControl>
                        </Stack>

                        <Typography variant="caption" color="text.secondary"
                                    sx={{mb: 1, display: 'block'}}>ВИКОНАВЕЦЬ</Typography>
                        {isPM ? (
                            <FormControl fullWidth size="small" sx={{mb: 2}}>
                                <Controller
                                    name="assignee"
                                    control={control}
                                    render={({field}) => (
                                        <Select {...field} displayEmpty>
                                            <MenuItem value=""><em>Не призначено</em></MenuItem>
                                            {users.map(u => (
                                                <MenuItem key={u.id} value={u.id}>
                                                    <Stack direction="row" alignItems="center" spacing={1}>
                                                        <Avatar sx={{
                                                            width: 24,
                                                            height: 24,
                                                            fontSize: 12
                                                        }}>{u.username[0]}</Avatar>
                                                        <span>{u.first_name} {u.last_name} ({u.username})</span>
                                                    </Stack>
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    )}
                                />
                            </FormControl>
                        ) : (
                            <Stack direction="row" spacing={1} alignItems="center" sx={{mb: 2}}>
                                <Avatar
                                    sx={{width: 32, height: 32}}>{task.assignee_details?.username?.[0] || '?'}</Avatar>
                                <Typography>{task.assignee_details ? `${task.assignee_details.first_name} ${task.assignee_details.last_name}` : "Не призначено"}</Typography>
                            </Stack>
                        )}

                        <Typography variant="caption" color="text.secondary" sx={{mb: 1, display: 'block'}}>ОЦІНКА
                            (STORY POINTS)</Typography>
                        {isPM ? (
                            <FormControl fullWidth size="small">
                                <Controller
                                    name="story_points"
                                    control={control}
                                    render={({field}) => (
                                        <Select {...field}>{[1, 2, 3, 5, 8, 13, 21].map(sp => <MenuItem key={sp}
                                                                                                        value={sp}>{sp} SP</MenuItem>)}</Select>
                                    )}
                                />
                            </FormControl>
                        ) : (
                            <Typography variant="h6">{task.story_points} SP</Typography>
                        )}

                        {/* === СПИСОК БАГІВ === */}
                        {task.bugs && task.bugs.length > 0 && (
                            <>
                                <Divider sx={{my: 2}}/>
                                <Typography variant="caption" color="error"
                                            sx={{mb: 1, display: 'block', fontWeight: 'bold'}}>
                                    ЗНАЙДЕНІ ПОМИЛКИ ({task.bugs.length})
                                </Typography>

                                <List dense sx={{bgcolor: '#fff4f4', borderRadius: 1}}>
                                    {task.bugs.map((bug: BugReport) => {
                                        const isClosed = bug.status === 'CLOSED' || bug.status === 'FIXED';
                                        return (
                                            <ListItem key={bug.id} disablePadding>
                                                <ListItemButton onClick={() => setSelectedBug(bug)}>
                                                    <ListItemIcon sx={{minWidth: 30}}>
                                                        {bug.status === 'FIXED' ? (
                                                            <CheckCircle color="success" fontSize="small"/>
                                                        ) : (
                                                            <WarningIcon color={isClosed ? "disabled" : "error"}
                                                                         fontSize="small"/>
                                                        )}
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary={
                                                            <Typography
                                                                variant="body2"
                                                                sx={{
                                                                    textDecoration: isClosed ? 'line-through' : 'none',
                                                                    color: isClosed ? 'text.disabled' : 'text.primary',
                                                                    fontWeight: 500
                                                                }}
                                                            >
                                                                {bug.title}
                                                            </Typography>
                                                        }
                                                        secondary={bug.status === 'NEW' ? bug.priority : `${bug.priority} | ${bug.status}`}
                                                    />
                                                </ListItemButton>
                                            </ListItem>
                                        );
                                    })}
                                </List>
                            </>
                        )}

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={onClose}>Закрити</Button>
                        {(isPM || isDev) && (
                            <Button type="submit" color="primary" variant="contained"
                                    startIcon={<SaveIcon/>}>Зберегти</Button>
                        )}
                    </DialogActions>
                </form>
            </StyledDialog>

            <ReportBugModal
                open={isBugModalOpen}
                onClose={() => setBugModalOpen(false)}
                onSuccess={handleBugSuccess}
                projectId={task.project}
                taskId={task.id}
                taskTitle={task.title}
            />

            <BugDetailsModal
                open={Boolean(selectedBug)}
                onClose={() => setSelectedBug(null)}
                bug={selectedBug}
                onUpdate={handleBugUpdate}
            />

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
            >
                <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{width: '100%'}}>
                    Баг успішно створено!
                </Alert>
            </Snackbar>
        </>
    );
};