import { Container, Grid, Typography, Box, TextField, Button, CircularProgress, Snackbar } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo-puc-minas.jpg';
import '../styles/register.css';
import { useState, useEffect } from 'react';
import MuiAlert from '@mui/material/Alert'; 
import EmpresService from '../services/EmpresService'; 

const RegisterEmpresa = ({ formData = {}, handleChange }) => {

    const navigate = useNavigate(); 
    const [isLoading, setIsLoading] = useState(false); 
    const [errorMessage, setErrorMessage] = useState(null);

    const [openToast, setOpenToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage(null);
    
        if (!formData.nome || !formData.senha || !formData.email) {
            setErrorMessage('Todos os campos são obrigatórios.');
            setOpenToast(true);
            setIsLoading(false);
            return;
        }

        try {
            await EmpresService.createEmpresa(formData);
            setToastMessage('Cadastro realizado com sucesso!');
            setOpenToast(true); 
            navigate('/partners');
        } catch (error) {
            console.error('Erro ao cadastrar empresa', error);
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
                    <img src={logo} alt="Logo" />
                </Grid>
                <Grid item xs={12} md={6} className="register-form" sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <Typography variant="h4" className="register-title" gutterBottom>
                        Cadastro de Empresa
                    </Typography>

                    <Box component="form" onSubmit={handleRegister} sx={{ width: '100%' }}>
                        <Grid container spacing={1} sx={{ paddingLeft: '2rem', paddingRight: '2rem' }}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Nome da Empresa"
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
                                    label="E-mail"
                                    type="email"
                                    margin="normal"
                                    variant="outlined"
                                    value={formData.email || ''}
                                    onChange={(e) => handleChange('email', e.target.value)}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Senha"
                                    type="password"
                                    margin="normal"
                                    variant="outlined"
                                    value={formData.senha || ''}
                                    onChange={(e) => handleChange('senha', e.target.value)}
                                    required
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
                                Registrar
                            </Button>
                        </Box>
                        <Typography align="center" variant="body2" color="textSecondary" className="register-redirect-options">
                            Já tem uma conta?
                            <Link to="/login" style={{ fontWeight: 'bold', color: '#1976d2', marginLeft: 5 }}>
                                Faça login
                            </Link>
                        </Typography>
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

export default RegisterEmpresa;
