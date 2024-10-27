/* eslint-disable react/prop-types */
// FloatingActionButton.js

import { SpeedDial, SpeedDialAction, SpeedDialIcon } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

const FloatingActionButton = ({ onAdd, onEdit, onDelete, onViewDetails }) => {
    const actions = [
        { icon: <AddIcon />, name: 'Adicionar Professor', onClick: onAdd },
        { icon: <EditIcon />, name: 'Editar Professor', onClick: onEdit },
        { icon: <DeleteIcon />, name: 'Excluir Professor', onClick: onDelete },
        { icon: <VisibilityIcon />, name: 'Visualizar Detalhes', onClick: onViewDetails },
    ];

    return (
        <SpeedDial
            ariaLabel="Opções de Professor"
            sx={{ position: 'fixed', bottom: 16, right: 16 }}
            icon={<SpeedDialIcon />}
        >
            {actions.map((action) => (
                <SpeedDialAction
                    key={action.name}
                    icon={action.icon}
                    tooltipTitle={action.name}
                    tooltipOpen
                    onClick={action.onClick}
                />
            ))}
        </SpeedDial>
    );
};

export default FloatingActionButton;
