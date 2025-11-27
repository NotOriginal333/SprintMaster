import React from 'react';
import { Typography, Box, Button, Table, TableBody, TableCell, TableHead, TableRow, Chip, IconButton } from '@mui/material';
import {
  BarChart as ChartIcon,
  Timeline as VelocityIcon,
  BugReport as BugIcon,
  CheckCircle as DoneIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { StatsGrid, StatCard, IconWrapper, ReportsTableContainer } from './ReportsPage.styles';

// Mock Data
const STATS = [
    { title: 'Velocity команди', value: '24 SP', icon: <VelocityIcon fontSize="large" />, color: '#1976d2' },
    { title: 'Закрито задач', value: '142', icon: <DoneIcon fontSize="large" />, color: '#2e7d32' },
    { title: 'Активні баги', value: '5', icon: <BugIcon fontSize="large" />, color: '#d32f2f' },
    { title: 'Всього проєктів', value: '3', icon: <ChartIcon fontSize="large" />, color: '#ed6c02' },
];

const HISTORY = [
    { id: 101, type: 'Підсумок спринта #1', date: '2023-11-27', status: 'READY', generated_by: 'Admin' },
    { id: 102, type: 'Статистика багів', date: '2023-11-26', status: 'READY', generated_by: 'QA Lead' },
    { id: 103, type: 'Звіт по проєкту X', date: '2023-11-26', status: 'PROCESSING', generated_by: 'Manager' },
];

export const ReportsPage = () => {
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
         <Box>
            <Typography variant="h4" fontWeight="bold">Звіти та Аналітика</Typography>
            <Typography variant="body2" color="text.secondary">Огляд продуктивності команди</Typography>
         </Box>
         <Button variant="contained" startIcon={<RefreshIcon />}>
             Згенерувати новий
         </Button>
      </Box>

      {/* 1. Картки статистики */}
      <StatsGrid>
        {STATS.map((stat, index) => (
            <StatCard key={index} elevation={1}>
                <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight="bold">
                        {stat.title.toUpperCase()}
                    </Typography>
                    <Typography variant="h4" fontWeight="bold">
                        {stat.value}
                    </Typography>
                </Box>
                <IconWrapper color={stat.color}>
                    {stat.icon}
                </IconWrapper>
            </StatCard>
        ))}
      </StatsGrid>

      {/* 2. Таблиця історії звітів */}
      <Typography variant="h6" gutterBottom fontWeight="bold">Історія звітів</Typography>
      <ReportsTableContainer elevation={1}>
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Назва звіту</TableCell>
                    <TableCell>Дата створення</TableCell>
                    <TableCell>Ініціатор</TableCell>
                    <TableCell>Статус</TableCell>
                    <TableCell align="right">Дії</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {HISTORY.map((row) => (
                    <TableRow key={row.id} hover>
                        <TableCell fontWeight="medium">{row.type}</TableCell>
                        <TableCell>{row.date}</TableCell>
                        <TableCell>{row.generated_by}</TableCell>
                        <TableCell>
                            <Chip
                                label={row.status === 'READY' ? 'Готовий' : 'Обробка'}
                                color={row.status === 'READY' ? 'success' : 'warning'}
                                size="small"
                            />
                        </TableCell>
                        <TableCell align="right">
                            <IconButton disabled={row.status !== 'READY'} color="primary">
                                <DownloadIcon />
                            </IconButton>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
      </ReportsTableContainer>
    </Box>
  );
};