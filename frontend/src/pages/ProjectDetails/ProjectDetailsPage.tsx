import React, {useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {
    Typography, Box, Button, Chip, IconButton, Avatar, Select, MenuItem,
    AvatarGroup, Tooltip, LinearProgress, Menu, ListItemIcon, ListItemText
} from '@mui/material';
import {
    Add as AddIcon, MoreHoriz, BugReport as BugIcon,
    CheckCircle, CalendarMonth as TimelineIcon, Check as CheckIcon,
    Settings as SettingsIcon, Edit as EditIcon, Delete as DeleteIcon
} from '@mui/icons-material';

import {BoardContainer, KanbanColumn, TaskCard} from './ProjectDetails.styles';
import {RoleGuard} from '../../utils/rbac';
import {TaskModal} from '../../components/TaskModal/TaskModal';
import {CreateTaskModal} from '../../components/CreateTaskModal/CreateTaskModal';
import {CreateSprintModal} from '../../components/CreateSprintModal/CreateSprintModal';
import {AddMemberModal} from '../../components/AddMemberModal/AddMemberModal';
import {ConfirmationDialog} from '../../components/ConfirmationDialog/ConfirmationDialog';
import {EditProjectModal} from '../../components/EditProjectModal/EditProjectModal';

import type {AppDispatch, RootState} from '../../store';
import {fetchTasks} from '../../store/tasksSlice';
import {fetchSprints, completeSprint} from '../../store/sprintsSlice';
import {fetchProjectById, deleteProject} from '../../store/projectsSlice';

const COLUMNS = [
    {id: 'NEW', title: 'To Do'},
    {id: 'IN_PROGRESS', title: 'In Progress'},
    {id: 'REVIEW', title: 'Code Review'},
    {id: 'DONE', title: 'Done'},
];

export const ProjectDetailsPage = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const {list: tasks, loading: tasksLoading} = useSelector((state: RootState) => state.tasks);
    const {list: sprints} = useSelector((state: RootState) => state.sprints);
    const {currentProject} = useSelector((state: RootState) => state.projects);

    const [selectedSprintId, setSelectedSprintId] = useState<number | 'all'>('all');
    const [detailTaskId, setDetailTaskId] = useState<number | null>(null);

    const [isTaskCreateOpen, setTaskCreateOpen] = useState(false);
    const [isSprintCreateOpen, setSprintCreateOpen] = useState(false);
    const [isMembersOpen, setMembersOpen] = useState(false);
    const [isEditProjectOpen, setEditProjectOpen] = useState(false); // <--- Стейт редагування

    const [isConfirmOpen, setConfirmOpen] = useState(false); // Для спринта
    const [isDeleteProjectOpen, setDeleteProjectOpen] = useState(false); // Для проєкту

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const openMenu = Boolean(anchorEl);

    useEffect(() => {
        if (id) {
            dispatch(fetchTasks(id));
            dispatch(fetchSprints(id));
            dispatch(fetchProjectById(id));
        }
    }, [dispatch, id]);

    const detailTask = tasks.find(t => t.id === detailTaskId) || null;
    const currentSprintObj = sprints.find(s => s.id === selectedSprintId);

    const filteredTasks = tasks.filter(t =>
        selectedSprintId === 'all' ? true : t.project === Number(id) && t.sprint === selectedSprintId
    );

    const onCompleteClick = () => {
        if (selectedSprintId !== 'all') setConfirmOpen(true);
    };

    const handleConfirmComplete = async () => {
        try {
            await dispatch(completeSprint(selectedSprintId as number)).unwrap();
            if (id) dispatch(fetchTasks(id));
            setSelectedSprintId('all');
        } catch (error) {
            console.error("Помилка завершення спринта", error);
        }
    };

    const handleDeleteProject = async () => {
        if (!id) return;
        try {
            await dispatch(deleteProject(Number(id))).unwrap();
            navigate('/dashboard');
        } catch (error) {
            console.error("Помилка видалення проєкту", error);
        }
    };

    if (!id) return null;

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Box>
                    <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="h4" fontWeight="bold">
                            {currentProject?.name || `Project #${id}`}
                        </Typography>

                        <RoleGuard allowedRoles={['PM', 'ADMIN']}>
                            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                                <SettingsIcon/>
                            </IconButton>
                            <Menu
                                anchorEl={anchorEl}
                                open={openMenu}
                                onClose={() => setAnchorEl(null)}
                            >
                                <MenuItem onClick={() => {
                                    setEditProjectOpen(true);
                                    setAnchorEl(null);
                                }}>
                                    <ListItemIcon><EditIcon fontSize="small"/></ListItemIcon>
                                    <ListItemText>Редагувати проєкт</ListItemText>
                                </MenuItem>
                                <MenuItem onClick={() => {
                                    setDeleteProjectOpen(true);
                                    setAnchorEl(null);
                                }} sx={{color: 'error.main'}}>
                                    <ListItemIcon><DeleteIcon fontSize="small" color="error"/></ListItemIcon>
                                    <ListItemText>Видалити проєкт</ListItemText>
                                </MenuItem>
                            </Menu>
                        </RoleGuard>
                    </Box>

                    <Box display="flex" alignItems="center" gap={3} mt={1}>
                        <Box display="flex" alignItems="center" gap={1}>
                            <Typography variant="body2" color="text.secondary">Спринт:</Typography>
                            <Select
                                size="small"
                                value={selectedSprintId}
                                onChange={(e) => setSelectedSprintId(e.target.value as number)}
                                sx={{minWidth: 150, height: 32}}
                            >
                                <MenuItem value="all">Всі задачі</MenuItem>
                                {sprints.map(s => (
                                    <MenuItem key={s.id} value={s.id}>
                                        {s.name} {s.is_active ? '(Active)' : ''}
                                    </MenuItem>
                                ))}
                            </Select>

                            {selectedSprintId !== 'all' && (
                                <Tooltip title="Відкрити хронологію та деталі спринту">
                                    <IconButton
                                        size="small"
                                        onClick={() => navigate(`/dashboard/sprints/${selectedSprintId}`)}
                                        color="primary"
                                    >
                                        <TimelineIcon/>
                                    </IconButton>
                                </Tooltip>
                            )}
                        </Box>

                        <Box display="flex" alignItems="center" gap={1}>
                            <AvatarGroup max={5}
                                         sx={{'& .MuiAvatar-root': {width: 32, height: 32, fontSize: '0.8rem'}}}>
                                {currentProject?.members_details?.map(m => (
                                    <Tooltip key={m.id} title={`${m.first_name} ${m.last_name} (${m.role})`}>
                                        <Avatar>{m.username[0].toUpperCase()}</Avatar>
                                    </Tooltip>
                                ))}
                            </AvatarGroup>

                            <RoleGuard allowedRoles={['PM', 'ADMIN']}>
                                <Button size="small" onClick={() => setMembersOpen(true)}>
                                    + Учасники
                                </Button>
                            </RoleGuard>
                        </Box>
                    </Box>
                </Box>

                <Box display="flex" gap={2}>
                    <RoleGuard allowedRoles={['PM', 'ADMIN']}>
                        {selectedSprintId !== 'all' && currentSprintObj?.is_active && (
                            <Button
                                variant="outlined"
                                color="success"
                                startIcon={<CheckIcon/>}
                                onClick={onCompleteClick}
                            >
                                Завершити спринт
                            </Button>
                        )}
                    </RoleGuard>

                    <RoleGuard allowedRoles={['PM', 'ADMIN']}>
                        <Button variant="outlined" onClick={() => setSprintCreateOpen(true)}>
                            Планувати спринт
                        </Button>
                    </RoleGuard>

                    <RoleGuard allowedRoles={['PM', 'ADMIN']}>
                        <Button variant="contained" startIcon={<AddIcon/>} onClick={() => setTaskCreateOpen(true)}>
                            Створити задачу
                        </Button>
                    </RoleGuard>
                </Box>
            </Box>

            {tasksLoading && <LinearProgress sx={{mb: 2}}/>}

            <BoardContainer>
                {COLUMNS.map((column) => (
                    <KanbanColumn key={column.id} elevation={0}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                            <Typography variant="subtitle1" fontWeight="bold" color="text.secondary">
                                {column.title}
                            </Typography>
                            <Chip label={filteredTasks.filter(t => t.status === column.id).length} size="small"/>
                        </Box>

                        {filteredTasks.filter(task => task.status === column.id).map(task => {
                            const bugs = task.bugs || [];
                            const activeBugs = bugs.filter(b => b.status !== 'CLOSED' && b.status !== 'FIXED').length;
                            const closedBugs = bugs.filter(b => b.status === 'CLOSED' || b.status === 'FIXED').length;

                            return (
                                <TaskCard key={task.id} elevation={1} onClick={() => setDetailTaskId(task.id)}>
                                    <Box display="flex" justifyContent="space-between" mb={1}>
                                        <Box display="flex" gap={1}>
                                            <Chip
                                                label={`${task.story_points} SP`}
                                                size="small"
                                                color={task.priority === 'CRITICAL' ? 'error' : 'default'}
                                                variant="outlined"
                                                sx={{height: 20, fontSize: '0.65rem'}}
                                            />
                                            {activeBugs > 0 && (
                                                <Tooltip title={`${activeBugs} активних помилок`}>
                                                    <Chip
                                                        icon={<BugIcon sx={{fontSize: '1rem !important'}}/>}
                                                        label={activeBugs}
                                                        size="small"
                                                        color="error"
                                                        sx={{height: 20, fontSize: '0.75rem', px: 0.5}}
                                                    />
                                                </Tooltip>
                                            )}
                                            {closedBugs > 0 && (
                                                <Tooltip title={`${closedBugs} виправлених помилок`}>
                                                    <Chip
                                                        icon={<CheckCircle sx={{fontSize: '1rem !important'}}/>}
                                                        label={closedBugs}
                                                        size="small"
                                                        color="success"
                                                        variant="outlined"
                                                        sx={{height: 20, fontSize: '0.75rem', px: 0.5}}
                                                    />
                                                </Tooltip>
                                            )}
                                        </Box>
                                        <IconButton size="small"><MoreHoriz fontSize="small"/></IconButton>
                                    </Box>
                                    <Typography variant="body1" fontWeight="500" gutterBottom>
                                        {task.title}
                                    </Typography>
                                    <Box display="flex" justifyContent="flex-end" alignItems="center" mt={2}>
                                        {task.assignee ? (
                                            <Tooltip title={task.assignee_details?.username || `User ${task.assignee}`}>
                                                <Avatar sx={{
                                                    width: 24,
                                                    height: 24,
                                                    fontSize: '0.75rem',
                                                    bgcolor: 'primary.main'
                                                }}>
                                                    {task.assignee_details?.username?.[0].toUpperCase() || '?'}
                                                </Avatar>
                                            </Tooltip>
                                        ) : (
                                            <Typography variant="caption" color="text.disabled">Unassigned</Typography>
                                        )}
                                    </Box>
                                </TaskCard>
                            );
                        })}
                    </KanbanColumn>
                ))}
            </BoardContainer>

            <TaskModal
                open={Boolean(detailTask)}
                onClose={() => setDetailTaskId(null)}
                task={detailTask}
            />

            <CreateTaskModal
                open={isTaskCreateOpen}
                onClose={() => setTaskCreateOpen(false)}
                projectId={id}
                sprintId={typeof selectedSprintId === 'number' ? selectedSprintId : undefined}
            />

            <CreateSprintModal
                open={isSprintCreateOpen}
                onClose={() => setSprintCreateOpen(false)}
                projectId={id}
            />

            {currentProject && (
                <>
                    <AddMemberModal
                        open={isMembersOpen}
                        onClose={() => setMembersOpen(false)}
                        project={currentProject}
                    />
                    <EditProjectModal
                        open={isEditProjectOpen}
                        onClose={() => setEditProjectOpen(false)}
                        project={currentProject}
                    />
                </>
            )}

            <ConfirmationDialog
                open={isConfirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleConfirmComplete}
                title="Завершити спринт?"
                description="Всі незавершені задачі будуть автоматично перенесені в Backlog. Спринт стане неактивним."
            />

            <ConfirmationDialog
                open={isDeleteProjectOpen}
                onClose={() => setDeleteProjectOpen(false)}
                onConfirm={handleDeleteProject}
                title="Видалити проєкт?"
                description="Ви впевнені, що хочете видалити цей проєкт? Всі задачі, спринти та звіти будуть видалені назавжди."
            />
        </Box>
    );
};