import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, Typography, Box, Chip, Divider, Grid, CircularProgress
} from '@mui/material';
import {Warning as WarningIcon, Person as PersonIcon, CheckCircle, Block} from '@mui/icons-material';
import type {BugReport} from '../../types';
import type {AppDispatch, RootState} from '../../store';
import {updateBugStatus} from '../../store/bugsSlice';
import {RoleGuard} from '../../utils/rbac';

interface Props {
    open: boolean;
    onClose: () => void;
    bug: BugReport | null;
    onUpdate?: () => void;
}

export const BugDetailsModal = ({open, onClose, bug, onUpdate}: Props) => {
    const dispatch = useDispatch<AppDispatch>();
    // Локальний стейт для відображення завантаження
    const [isUpdating, setIsUpdating] = useState(false);

    if (!bug) return null;

    const handleStatusChange = async (newStatus: string) => {
        setIsUpdating(true); // Включаємо лоадер
        try {
            await dispatch(updateBugStatus({id: bug.id, status: newStatus})).unwrap();
            if (onUpdate) onUpdate(); // Оновлюємо список задач
            onClose();
        } catch (e) {
            console.error("Failed to update bug status", e);
        } finally {
            setIsUpdating(false); // Вимикаємо лоадер
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                color: bug.status === 'CLOSED' ? 'text.secondary' : '#d32f2f'
            }}>
                <WarningIcon color={bug.status === 'CLOSED' ? 'disabled' : 'error'}/>
                <Typography variant="h6" sx={{textDecoration: bug.status === 'CLOSED' ? 'line-through' : 'none'}}>
                    BUG-{bug.id}: {bug.title}
                </Typography>
            </DialogTitle>

            <DialogContent>
                {/* Статуси */}
                <Box display="flex" gap={1} mb={3}>
                    <Chip
                        label={bug.priority}
                        color={bug.priority === 'CRITICAL' ? 'error' : 'warning'}
                        size="small"
                        variant={bug.status === 'CLOSED' ? 'outlined' : 'filled'}
                    />
                    <Chip
                        label={bug.status}
                        variant="outlined"
                        size="small"
                        color={bug.status === 'CLOSED' ? 'success' : 'default'}
                    />
                </Box>

                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    ОПИС ПРОБЛЕМИ
                </Typography>
                <Typography variant="body1"
                            sx={{whiteSpace: 'pre-wrap', mb: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1}}>
                    {bug.description}
                </Typography>

                <Divider sx={{mb: 2}}/>

                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">Створено</Typography>
                        <Typography variant="body2">
                            {new Date(bug.created_at).toLocaleDateString()}
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">Репортер</Typography>
                        <Box display="flex" alignItems="center" gap={0.5}>
                            <PersonIcon fontSize="small" color="action"/>
                            <Typography variant="body2">
                                {bug.reporter_details?.username || `User #${bug.reporter}`}
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>

            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={isUpdating}>Скасувати</Button>

                {/* КНОПКИ ДІЙ З ЛОАДЕРОМ */}
                <RoleGuard allowedRoles={['DEV', 'PM', 'ADMIN']}>
                    {bug.status !== 'FIXED' && bug.status !== 'CLOSED' && (
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={isUpdating ? <CircularProgress size={20} color="inherit"/> : <CheckCircle/>}
                            onClick={() => handleStatusChange('FIXED')}
                            disabled={isUpdating}
                        >
                            {isUpdating ? 'Збереження...' : 'Виправлено'}
                        </Button>
                    )}
                </RoleGuard>

                <RoleGuard allowedRoles={['QA', 'PM', 'ADMIN']}>
                    {bug.status !== 'CLOSED' && (
                        <Button
                            variant="contained"
                            color="success"
                            startIcon={isUpdating ? <CircularProgress size={20} color="inherit"/> : <Block/>}
                            onClick={() => handleStatusChange('CLOSED')}
                            disabled={isUpdating}
                        >
                            {isUpdating ? 'Зачекайте...' : 'Закрити баг'}
                        </Button>
                    )}
                </RoleGuard>
            </DialogActions>
        </Dialog>
    );
};