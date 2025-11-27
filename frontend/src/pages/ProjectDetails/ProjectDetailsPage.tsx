import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Box, Button, Chip, IconButton, Avatar } from '@mui/material';
import { Add as AddIcon, MoreHoriz } from '@mui/icons-material';
import { BoardContainer, KanbanColumn, TaskCard } from './ProjectDetails.styles';
import { RoleGuard } from '../../utils/rbac';
import { TaskModal } from '../../components/TaskModal/TaskModal';

const COLUMNS = [
    { id: 'NEW', title: 'To Do' },
    { id: 'IN_PROGRESS', title: 'In Progress' },
    { id: 'REVIEW', title: 'Code Review' },
    { id: 'DONE', title: 'Done' },
];

const MOCK_TASKS = [
    { id: 101, title: 'Налаштувати Docker', description: 'Описати Dockerfile та compose', status: 'DONE', priority: 'HIGH', sp: 5, assignee: 'Ivan' },
    { id: 102, title: 'Створити сторінку логіну', description: 'Використати React Hook Form', status: 'IN_PROGRESS', priority: 'CRITICAL', sp: 3, assignee: 'Maria' },
    { id: 103, title: 'Верстка Канбан дошки', description: 'MUI Grid та Drag and Drop', status: 'NEW', priority: 'MEDIUM', sp: 8, assignee: null },
];

export const ProjectDetailsPage = () => {
  const { id } = useParams();

  // Логіка модального вікна
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleTaskClick = (task: any) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
            <Typography variant="h4" fontWeight="bold">Проєкт #{id}</Typography>
            <Typography variant="body2" color="text.secondary">Активний спринт: Sprint #1</Typography>
        </Box>
        <Box>
             {/* Тільки PM/ADMIN бачить налаштування */}
             <RoleGuard allowedRoles={['PM', 'ADMIN']}>
                <Button variant="outlined" sx={{ mr: 2 }}>Налаштування</Button>
             </RoleGuard>

             {/* Тільки PM/ADMIN створює задачі */}
             <RoleGuard allowedRoles={['PM', 'ADMIN']}>
                <Button variant="contained" startIcon={<AddIcon />}>Створити задачу</Button>
             </RoleGuard>
        </Box>
      </Box>

      {/* Канбан Дошка */}
      <BoardContainer>
        {COLUMNS.map((column) => (
            <KanbanColumn key={column.id} elevation={0}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="subtitle1" fontWeight="bold" color="text.secondary">
                        {column.title}
                    </Typography>
                    <Chip label={MOCK_TASKS.filter(t => t.status === column.id).length} size="small" />
                </Box>

                {MOCK_TASKS.filter(task => task.status === column.id).map(task => (
                    <TaskCard
                        key={task.id}
                        elevation={1}
                        onClick={() => handleTaskClick(task)} // Відкриття модалки
                    >
                        <Box display="flex" justifyContent="space-between" mb={1}>
                            <Chip
                                label={`${task.sp} SP`}
                                size="small"
                                color={task.priority === 'CRITICAL' ? 'error' : 'default'}
                                variant="outlined"
                                sx={{ height: 20, fontSize: '0.65rem' }}
                            />
                            <IconButton size="small"><MoreHoriz fontSize="small" /></IconButton>
                        </Box>
                        <Typography variant="body1" fontWeight="500" gutterBottom>
                            {task.title}
                        </Typography>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                            <Typography variant="caption" color="text.secondary">ID-{task.id}</Typography>
                            {task.assignee ? (
                                <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem', bgcolor: 'primary.main' }}>
                                    {task.assignee[0]}
                                </Avatar>
                            ) : (
                                <Typography variant="caption" color="text.disabled">Unassigned</Typography>
                            )}
                        </Box>
                    </TaskCard>
                ))}
            </KanbanColumn>
        ))}
      </BoardContainer>

      {/* Саме модальне вікно */}
      <TaskModal
        open={isModalOpen}
        onClose={handleCloseModal}
        task={selectedTask}
      />
    </Box>
  );
};