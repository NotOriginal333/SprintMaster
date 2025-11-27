import React from 'react';
import {
  DialogContent, DialogActions, Button, Typography,
  Select, MenuItem, FormControl, InputLabel, TextField, Avatar, Stack, Box
} from '@mui/material';
import { StyledDialog, HeaderBox, SectionTitle } from './TaskModal.styles';
import { RoleGuard } from '../../utils/rbac';

interface Task {
  id: number;
  title: string;
  description?: string; // Зробив необов'язковим, щоб не ламалось на моках
  status: string;
  priority: string;
  sp: number;
  assignee: string | null;
}

interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  task: Task | null;
}

export const TaskModal = ({ open, onClose, task }: TaskModalProps) => {
  if (!task) return null;

  return (
    <StyledDialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogContent>
        {/* Заголовок */}
        <HeaderBox>
            <Box>
                <Typography variant="caption" color="text.secondary">TASK-{task.id}</Typography>
                <Typography variant="h5" fontWeight="bold">{task.title}</Typography>
            </Box>
            <Stack direction="row" spacing={1}>
                {/* Тільки QA бачить кнопку репорту */}
                <RoleGuard allowedRoles={['QA']}>
                    <Button variant="outlined" color="error" size="small">
                        Report Bug
                    </Button>
                </RoleGuard>
            </Stack>
        </HeaderBox>

        <Typography variant="body1" sx={{ mb: 3 }}>
            {task.description || "Опис відсутній..."}
        </Typography>

        <Stack direction="row" spacing={2}>
            {/* Статус: Dropdown для DEV/PM, Text для QA */}
            <FormControl fullWidth size="small">
                <InputLabel>Статус</InputLabel>

                {/* Редагування: DEV, PM, ADMIN */}
                <RoleGuard allowedRoles={['DEV', 'PM', 'ADMIN']}>
                    <Select value={task.status} label="Статус" defaultValue={task.status}>
                        <MenuItem value="NEW">To Do</MenuItem>
                        <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                        <MenuItem value="REVIEW">Code Review</MenuItem>
                        <MenuItem value="DONE">Done</MenuItem>
                    </Select>
                </RoleGuard>

                {/* Перегляд: QA (або якщо роль не підійшла вище, але тут спрощено) */}
                <RoleGuard allowedRoles={['QA']}>
                     <TextField
                        value={task.status}
                        label="Статус"
                        size="small"
                        InputProps={{ readOnly: true }}
                     />
                </RoleGuard>
            </FormControl>

            <FormControl fullWidth size="small">
                <InputLabel>Priority</InputLabel>
                <Select value={task.priority} label="Priority" readOnly>
                    <MenuItem value="LOW">Low</MenuItem>
                    <MenuItem value="MEDIUM">Medium</MenuItem>
                    <MenuItem value="HIGH">High</MenuItem>
                    <MenuItem value="CRITICAL">Critical</MenuItem>
                </Select>
            </FormControl>
        </Stack>

        <SectionTitle>Виконавець</SectionTitle>
        <Stack direction="row" spacing={1} alignItems="center">
            <Avatar sx={{ width: 32, height: 32 }}>{task.assignee?.[0] || '?'}</Avatar>
            <Typography>{task.assignee || 'Unassigned'}</Typography>
        </Stack>

        <SectionTitle>Оцінка (Story Points)</SectionTitle>
        <Typography variant="h6">{task.sp} SP</Typography>

      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Закрити</Button>
        {/* Тільки Менеджер може зберігати зміни (глобально) у цій версії */}
        <RoleGuard allowedRoles={['PM', 'ADMIN', 'DEV']}>
            <Button color="primary" variant="contained">Зберегти</Button>
        </RoleGuard>
      </DialogActions>
    </StyledDialog>
  );
};