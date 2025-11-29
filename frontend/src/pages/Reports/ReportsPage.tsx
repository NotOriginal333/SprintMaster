import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Typography, Box, Button, Table, TableBody, TableCell, TableHead,
    TableRow, Chip, Dialog, DialogTitle, DialogContent,
    TextField, MenuItem, DialogActions, LinearProgress, Paper
} from '@mui/material';
import {
  BarChart as ChartIcon, Add as AddIcon, CheckCircle, HourglassEmpty
} from '@mui/icons-material';

import type { AppDispatch, RootState } from '../../store';
import { fetchReports, createReport } from '../../store/reportsSlice';
import { fetchProjects } from '../../store/projectsSlice';
import { StatsGrid, StatCard, IconWrapper, ReportsTableContainer } from './ReportsPage.styles';

export const ReportsPage = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Безпечне отримання даних (щоб не було undefined errors)
  const { list: reports = [], loading } = useSelector((state: RootState) => state.reports || {});
  const { list: projects = [] } = useSelector((state: RootState) => state.projects || {});

  const [open, setOpen] = useState(false);
  const [projectId, setProjectId] = useState('');
  const [type, setType] = useState('PROJECT');

  // 1. Початкове завантаження
  useEffect(() => {
    dispatch(fetchReports());
    dispatch(fetchProjects());
  }, [dispatch]);

  // 2. ЖИВЕ ОНОВЛЕННЯ (POLLING)
  // Якщо є звіти в статусі "Обробка" (is_ready === false), оновлюємо список кожні 3 сек
  useEffect(() => {
    const hasPendingReports = reports.some(r => !r.is_ready);

    let intervalId: any = null;

    if (hasPendingReports) {
        intervalId = setInterval(() => {
            // Тихе оновлення (без спінера loading, бо він у Redux і так буде блимати)
            dispatch(fetchReports());
        }, 3000);
    }

    return () => {
        if (intervalId) clearInterval(intervalId);
    };
  }, [reports, dispatch]);

  const handleCreate = async () => {
    if (!projectId) return;
    try {
        await dispatch(createReport({ project: Number(projectId), report_type: type })).unwrap();
        setOpen(false);
        // Після створення зразу оновлюємо список, щоб побачити "Processing"
        dispatch(fetchReports());
    } catch (e) {
        console.error("Помилка створення звіту:", e);
    }
  };

  // Функція для красивого відображення JSON результату
  const renderReportData = (data: any) => {
    if (!data || Object.keys(data).length === 0) return "Немає даних";

    // Якщо це наш формат з бекенду
    if (data.story_points) {
        return (
            <Box sx={{ fontSize: '0.75rem' }}>
                <div><strong>Tasks:</strong> {data.tasks?.completed}/{data.tasks?.total}</div>
                <div><strong>Progress:</strong> {data.story_points?.progress_percent}</div>
                <div><strong>Quality:</strong> {data.quality?.health}</div>
            </Box>
        );
    }
    return JSON.stringify(data).slice(0, 50) + "...";
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
         <Box>
            <Typography variant="h4" fontWeight="bold">Звіти та Аналітика</Typography>
            <Typography variant="body2" color="text.secondary">Автоматична генерація через Celery</Typography>
         </Box>
         <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
             Згенерувати новий
         </Button>
      </Box>

      <StatsGrid>
         <StatCard elevation={1}>
             <Box>
                 <Typography variant="caption" color="text.secondary">ВСЬОГО ЗВІТІВ</Typography>
                 <Typography variant="h4" fontWeight="bold">{reports.length}</Typography>
             </Box>
             <IconWrapper color="#1976d2"><ChartIcon /></IconWrapper>
         </StatCard>
      </StatsGrid>

      {/* Якщо йде перше завантаження і список пустий - показуємо лінію */}
      {loading && reports.length === 0 && <LinearProgress sx={{ mb: 2 }} />}

      <ReportsTableContainer elevation={1}>
        <Table>
            <TableHead>
                <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                    <TableCell>ID</TableCell>
                    <TableCell>Тип звіту</TableCell>
                    <TableCell>Проєкт</TableCell>
                    <TableCell>Статус</TableCell>
                    <TableCell>Результат</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {reports.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={5} align="center">Звітів поки немає</TableCell>
                    </TableRow>
                ) : (
                    reports.map((row) => (
                        <TableRow key={row.id} hover>
                            <TableCell>#{row.id}</TableCell>
                            <TableCell fontWeight="medium">
                                {row.report_type === 'PROJECT' && 'Статус проєкту'}
                                {row.report_type === 'SPRINT' && 'Підсумок спринта'}
                                {row.report_type === 'BUGS' && 'Аналіз багів'}
                            </TableCell>
                            <TableCell>
                                {/* Шукаємо назву проєкту по ID */}
                                {projects.find(p => p.id === row.project)?.name || `Project #${row.project}`}
                            </TableCell>
                            <TableCell>
                                <Chip
                                    icon={row.is_ready ? <CheckCircle /> : <HourglassEmpty />}
                                    label={row.is_ready ? 'Готовий' : 'Обробка...'}
                                    color={row.is_ready ? 'success' : 'warning'}
                                    size="small"
                                    variant="outlined"
                                />
                            </TableCell>
                            <TableCell>
                                {row.is_ready ? renderReportData(row.data) : (
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <LinearProgress sx={{ width: 100 }} />
                                        <Typography variant="caption" color="text.secondary">Celery працює</Typography>
                                    </Box>
                                )}
                            </TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
      </ReportsTableContainer>

      {/* Модалка */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Створити новий звіт</DialogTitle>
        <DialogContent sx={{ minWidth: 400, pt: 2 }}>
            <TextField
                select
                label="Виберіть проєкт"
                fullWidth
                margin="normal"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
            >
                {projects.map((p) => (
                    <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
                ))}
            </TextField>
            <TextField
                select
                label="Тип звіту"
                fullWidth
                margin="normal"
                value={type}
                onChange={(e) => setType(e.target.value)}
            >
                <MenuItem value="PROJECT">Статус проєкту</MenuItem>
                <MenuItem value="SPRINT">Підсумок спринта</MenuItem>
                <MenuItem value="BUGS">Статистика багів</MenuItem>
            </TextField>
        </DialogContent>
        <DialogActions>
            <Button onClick={() => setOpen(false)}>Скасувати</Button>
            <Button onClick={handleCreate} variant="contained">Запустити</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};