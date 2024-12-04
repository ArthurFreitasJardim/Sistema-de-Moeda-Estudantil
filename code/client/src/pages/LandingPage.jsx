import { Box, Typography, Grid, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate(); 

    return (
        <div>
            <Box sx={{ display: 'flex', marginTop: '1rem' }}>
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        bgcolor: 'background.default',
                        p: 3,
                        height: '100vh',
                    }}
                >
                    <Box
                        sx={{
                            mt: 3,
                            bgcolor: '#f9f9f9',
                            p: 3,
                            borderRadius: '16px',
                            boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        <Typography variant="h5" sx={{ mb: 2 }}>
                            Cadastrar ou Registrar
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={2}>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    sx={{
                                        bgcolor: '#1074b4',
                                        '&:hover': {
                                            bgcolor: '#005ea1',
                                        },
                                    }}
                                    onClick={() => navigate('/instituicao')}  
                                >
                                    Cadastrar Instituição
                                </Button>
                            </Grid>
                            <Grid item xs={12} sm={2}>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    sx={{
                                        bgcolor: '#1074b4',
                                        '&:hover': {
                                            bgcolor: '#005ea1',
                                        },
                                    }}
                                    onClick={() => navigate('/register')} 
                                >
                                    Cadastrar Usuário/ Aluno
                                </Button>
                            </Grid>
                            <Grid item xs={12} sm={2}>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    sx={{
                                        bgcolor: '#1074b4',
                                        '&:hover': {
                                            bgcolor: '#005ea1',
                                        },
                                    }}
                                    onClick={() => navigate('/registrar-professor')}  // Navegar para página de registrar professor
                                >
                                    Cadastrar Professor
                                </Button>
                            </Grid>
                            <Grid item xs={12} sm={2}>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    sx={{
                                        bgcolor: '#1074b4',
                                        '&:hover': {
                                            bgcolor: '#005ea1',
                                        },
                                    }}
                                    onClick={() => navigate('/cadastrar-empresa')}  // Navegar para página de cadastrar empresa
                                >
                                    Cadastrar Empresa Parceira
                                </Button>
                            </Grid>
                            <Grid item xs={12} sm={2}>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    sx={{
                                        bgcolor: '#1074b4',
                                        '&:hover': {
                                            bgcolor: '#005ea1',
                                        },
                                    }}
                                    onClick={() => navigate('/cadastrar-curso')}  // Navegar para página de cadastrar curso
                                >
                                    Cadastrar Curso
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Box>
        </div>
    );
};

export default LandingPage;
