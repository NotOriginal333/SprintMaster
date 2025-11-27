import React from 'react';
import {
  Typography, Box, Paper, Table, TableBody, TableCell,
  TableHead, TableRow, Chip, Button
} from '@mui/material';
import { FilterList as FilterIcon } from '@mui/icons-material';
import { FilterBar, PriorityBadge } from './MyTasksPage.styles';

const TASKS = [
    { id: 205, title: 'Фікс багу авторизації', project: 'Course Work System', status: 'IN_PROGRESS', priority: 'CRITICAL', due: '2023-11-28' },
    { id: 208, title: 'Написати документацію API', project: 'Course Work System', status: 'NEW', priority: 'MEDIUM', due: '2023-11-30' },
    { id: 301, title: 'Оптимізація SQL запитів', project: 'Legacy CRM', status: 'REVIEW', priority: 'HIGH', due: '2023-11-25' },
];

export const MyTasksPage = () => {
  return (
    <Box>
       <Typography variant="h4" fontWeight="bold" gutterBottom>Мої задачі</Typography>

       <FilterBar>
          <Button variant="outlined" startIcon={<FilterIcon />}>
              Фільтр: Всі
          </Button>
          <Button variant="outlined">Тільки активні</Button>
       </FilterBar>

       <Paper elevation={1}>
          <Table>
            <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell>ID</TableCell>
                    <TableCell width="40%">Назва задачі</TableCell>
                    <TableCell>Проєкт</TableCell>
                    <TableCell>Статус</TableCell>
                    <TableCell>Пріоритет</TableCell>
                    <TableCell>Дедлайн</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {TASKS.map((task) => (
                    <TableRow key={task.id} hover sx={{ cursor: 'pointer' }}>
                        <TableCell color="text.secondary">#{task.id}</TableCell>
                        <TableCell sx={{ fontWeight: 500 }}>{task.title}</TableCell>
                        <TableCell>{task.project}</TableCell>
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
                        <TableCell>{task.due}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
          </Table>
       </Paper>
    </Box>
  );
};