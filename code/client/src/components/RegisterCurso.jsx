import { Container, Grid, Typography, Box, TextField, Button, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo-puc-minas.jpg';
import '../styles/register.css';
import { useState, useEffect } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert'; 
import CursoService from '../services/CursoService'; 

const RegisterCourse = ({ formData = {}, handleChange }) => {

    const navigate = useNavigate(); 
    const [isLoading, setIsLoading] = useState(false); 
    const [errorMessage, setErrorMessage] = useState(null);


    const [openToast, setOpenToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage(null);  
    
        try {
            await CursoService.createCurso(formData);
            setToastMessage('Curso cadastrado com sucesso!');
            setOpenToast(true); 
            navigate('/courses'); 
        } catch (error) {
            console.error('Erro ao cadastrar curso', error);
            setToastMessage('Erro ao realizar cadastro. Tente novamente.');
            setOpenToast(true); 
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <Typography>Carregando...</Typography>;
    }


    const handleToastClose = () => {
        setOpenToast(false);
    };

    return (
        <Container maxWidth="md" className="register-container">
            <Grid container spacing={2} style={{ height: '85vh' }}>
                <Grid item xs={12} md={6} className="login-image-logo-container">
                    <img src={logo} alt="Logo PUC Minas" />
                </Grid>
                <Grid item xs={12} md={6} className="register-form" sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <Typography variant="h4" className="register-title" gutterBottom>
                        Cadastro de Curso
                    </Typography>

                    <Box component="form" onSubmit={handleRegister} sx={{ width: '100%' }}>
                        <Grid container spacing={1} sx={{ paddingLeft: '2rem', paddingRight: '2rem' }}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Nome do Curso"
                                    margin="normal"
                                    variant="outlined"
                                    value={formData.nome || ''}
                                    onChange={(e) => handleChange('nome', e.target.value)}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Descrição"
                                    margin="normal"
                                    variant="outlined"
                                    value={formData.descricao || ''}
                                    onChange={(e) => handleChange('descricao', e.target.value)}
                                    required
                                    multiline
                                    rows={4}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Carga Horária (em horas)"
                                    margin="normal"
                                    variant="outlined"
                                    value={formData.cargaHoraria || ''}
                                    onChange={(e) => handleChange('cargaHoraria', e.target.value)}
                                    required
                                    type="number"
                                    InputProps={{
                                        inputProps: { min: 1 }
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Box mt={2} mb={1} style={{ padding: '2rem' }}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                disabled={isLoading}
                                startIcon={isLoading && <CircularProgress size={20} color="inherit" />}
                            >
                                Registrar Curso
                            </Button>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
            <Snackbar
                open={openToast}
                autoHideDuration={6000}
                onClose={handleToastClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <MuiAlert onClose={handleToastClose} severity={errorMessage ? 'error' : 'success'} sx={{ width: '100%' }}>
                    {toastMessage}
                </MuiAlert>
            </Snackbar>
        </Container>
    );
};

export default RegisterCourse;
