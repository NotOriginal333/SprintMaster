import {styled} from '@mui/material/styles';
import {Paper, Box, TableRow, Chip, TextField, FormControl} from '@mui/material';
import {Warning} from '@mui/icons-material';

export const FilterPaper = styled(Paper)(({theme}) => ({
    padding: theme.spacing(2),
    marginBottom: theme.spacing(3),
    display: 'flex',
    gap: theme.spacing(2),
    alignItems: 'center',
    flexWrap: 'wrap',
}));

export const SearchField = styled(TextField)({
    width: 300,
});

export const StatusControl = styled(FormControl)({
    minWidth: 200,
});

export const TableHeaderRow = styled(TableRow)(({theme}) => ({
    backgroundColor: '#f5f5f5',
}));

export const ClickableTableRow = styled(TableRow)(({theme}) => ({
    cursor: 'pointer',
    '&:hover': {
        backgroundColor: theme.palette.action.hover,
    },
}));

export const DueDateText = styled('span')<{ isOverdue: boolean }>(({theme, isOverdue}) => ({
    color: isOverdue ? theme.palette.error.main : 'inherit',
    fontWeight: isOverdue ? 'bold' : 'normal',
}));

export const BugChip = styled(Chip)(({theme}) => ({
    height: 24,
    paddingLeft: theme.spacing(0.5),
    paddingRight: theme.spacing(0.5),
}));

export const SmallWarningIcon = styled(Warning)({
    fontSize: '1rem !important',
});

export const PriorityBadge = styled('span')<{ priority: string }>(({theme, priority}) => {
    const colors: Record<string, string> = {
        LOW: theme.palette.info.main,
        MEDIUM: theme.palette.warning.main,
        HIGH: theme.palette.error.light,
        CRITICAL: theme.palette.error.main,
    };
    return {
        color: colors[priority] || theme.palette.text.primary,
        fontWeight: 'bold',
        fontSize: '0.85rem',
    };
});