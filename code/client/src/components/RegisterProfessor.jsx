import { Container, Grid, Typography, Box, TextField, Button, CircularProgress, MenuItem } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo-puc-minas.jpg';
import '../styles/register.css';
import { useState, useEffect } from 'react';
import InputMask from 'react-input-mask';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import InstituicaoService from '../services/InstituicaoService';
import ProfessorService from '../services/ProfessorService';

const RegisterProfessor = ({ formData = {}, handleChange }) => {

    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [instituicoes, setInstituicoes] = useState([]);  // Mudado para um array
    const [errorMessage, setErrorMessage] = useState(null);

    const [openToast, setOpenToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage(null);

        console.log('Form data before submit:', formData);

        try {
            await ProfessorService.createProfessor(formData);
            setToastMessage('Cadastro de professor realizado com sucesso!');
            setOpenToast(true);
            navigate('/login');
        } catch (error) {
            console.error('Erro ao cadastrar professor', error);
            setToastMessage('Erro ao realizar cadastro. Tente novamente.');
            setOpenToast(true);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <Typography>Carregando...</Typography>;
    }

    useEffect(() => {
        const fetchInstituicoes = async () => {
            try {
                const instituicoesData = await InstituicaoService.getAllInstituicao();
                console.log("Instituições recebidas:", instituicoesData)
                setInstituicoes(instituicoesData);  
            } catch (error) {
                console.error('Erro ao buscar instituições', error);
            }
        };

        fetchInstituicoes();
    }, []);


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
                        Cadastro de Professor
                    </Typography>

                    <Box component="form" onSubmit={handleRegister} sx={{ width: '100%' }}>
                        <Grid container spacing={1} sx={{ paddingLeft: '2rem', paddingRight: '2rem' }}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Nome"
                                    margin="normal"
                                    variant="outlined"
                                    value={formData.nome || ''}
                                    onChange={(e) => handleChange('nome', e.target.value)}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="E-mail (Login)"
                                    type="email"
                                    margin="normal"
                                    variant="outlined"
                                    value={formData.login || ''}
                                    onChange={(e) => handleChange('login', e.target.value)}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <InputMask
                                    mask="999.999.999-99"
                                    value={formData.cpf || ''}
                                    onChange={(e) => handleChange('cpf', e.target.value)}
                                >
                                    {(inputProps) => (
                                        <TextField
                                            {...inputProps}
                                            fullWidth
                                            label="CPF"
                                            margin="normal"
                                            variant="outlined"
                                            required
                                        />
                                    )}
                                </InputMask>
                            </Grid>
                            <Grid item xs={12} sm={6}>
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
                            <Grid item xs={12} sm={12}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Instituição de Ensino"
                                    margin="normal"
                                    variant="outlined"
                                    value={formData.instituicao || ''}
                                    onChange={(e) => handleChange('instituicao', e.target.value)}
                                    required
                                >
                                    {instituicoes && instituicoes.map((instituicao) => (
                                        <MenuItem key={instituicao.id} value={instituicao.id}>
                                            {instituicao.nome}
                                        </MenuItem>
                                    ))}
                                </TextField>
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

export default RegisterProfessor;
