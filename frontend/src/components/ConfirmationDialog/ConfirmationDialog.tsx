import React from 'react';
import {Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, DialogContentText} from '@mui/material';
import {Warning as WarningIcon} from '@mui/icons-material';

interface Props {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    description?: string;
}

export const ConfirmationDialog = ({
                                       open, onClose, onConfirm,
                                       title = "Ви впевнені?",
                                       description = "Цю дію не можна буде скасувати."
                                   }: Props) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                <WarningIcon color="warning"/>
                {title}
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {description}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="inherit">Скасувати</Button>
                <Button onClick={() => {
                    onConfirm();
                    onClose();
                }} variant="contained" color="primary">
                    Підтвердити
                </Button>
            </DialogActions>
        </Dialog>
    );
};