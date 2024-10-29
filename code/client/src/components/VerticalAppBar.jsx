import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    IconButton,
    AppBar,
    Toolbar,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import logo from '../assets/logo-puc-minas.jpg';
import AssignmentIcon from '@mui/icons-material/Assignment';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import ListAltIcon from '@mui/icons-material/ListAlt';
import StarIcon from '@mui/icons-material/Star';
import SchoolIcon from '@mui/icons-material/School';
import GroupIcon from '@mui/icons-material/Group';
import PeopleIcon from '@mui/icons-material/People';
import BusinessIcon from '@mui/icons-material/Business';
import '../styles/VerticalAppBar.css';

const VerticalAppBar = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    const toggleDrawer = () => {
        setOpen(!open);
    };

    const menuItems = [
        { text: 'Resgatar Pontos', icon: <MonetizationOnIcon />, path: '/resgatar-pontos' },
        { text: 'Extrato', icon: <ListAltIcon />, path: '/extrato' },
        { text: 'Metas', icon: <StarIcon />, path: '/metas' },
        { text: 'Desafios', icon: <AssignmentIcon />, path: '/desafios' },
        { text: 'Cupons', icon: <VolunteerActivismIcon />, path: '/cupons' },
        { text: 'Empresas Parceiras', icon: <BusinessIcon />, path: '/partners' },
        { text: 'Professores', icon: <PeopleIcon />, path: '/teachers' },
        { text: 'Cursos', icon: <SchoolIcon />, path: '/courses' },
        { text: 'Alunos', icon: <GroupIcon />, path: '/students' },
    ];

    const handleClick = (path) => {
        navigate(path);
        toggleDrawer();
    };

    return (
        <div>
            <AppBar position="static" className='app-bar-header' sx={{ backgroundColor: '#ffffff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <IconButton edge="start" color="inherit" onClick={toggleDrawer}>
                        <MenuIcon sx={{ color: '#1074b4' }} />
                    </IconButton>
                    <IconButton edge="end" color="inherit">
                        <img src={logo} alt="Logo da PUC Minas" style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '16px' }} />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Drawer
                anchor="left"
                open={open}
                onClose={toggleDrawer}
                sx={{
                    '& .MuiDrawer-paper': {
                        width: 240,
                        backgroundColor: '#f7f7f7',
                        color: '#000000',
                    },
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px' }}>
                    <IconButton onClick={toggleDrawer} sx={{ color: '#1074b4' }}>
                        <CloseIcon />
                    </IconButton>
                </div>
                <List>
                    {menuItems.map((item, index) => (
                        <ListItem
                            button
                            key={index}
                            onClick={() => handleClick(item.path)}
                            sx={{
                                '&:hover': {
                                    backgroundColor: '#e0f7fa',
                                },
                                padding: '10px 20px',
                                cursor: 'pointer'
                            }}
                        >
                            <ListItemIcon sx={{ color: '#1074b4' }}>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} sx={{ color: '#1074b4' }} />
                        </ListItem>
                    ))}
                </List>
            </Drawer>
        </div>
    );
};

export default VerticalAppBar;
