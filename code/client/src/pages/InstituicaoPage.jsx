import { Container, Grid, Typography, Box, TextField, Button, CircularProgress } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InstituicaoService from '../services/InstituicaoService'; 
import '../styles/register.css';

const CreateInstituicao = () => {

    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        nome: '',
    });
    const [errorMessage, setErrorMessage] = useState(null);

    const handleChange = (field, value) => {
        setFormData({
            ...formData,
            [field]: value,
        });
    };

    const handleCreateInstituicao = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage(null);

        try {
            await InstituicaoService.createInstituicao(formData); 
            navigate('/register'); 
        } catch (error) {
            console.error('Erro ao criar instituição', error);
            setErrorMessage('Erro ao criar instituição. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container maxWidth="md" className="register-container">
            <Grid container spacing={2} style={{ height: '85vh' }}>
                <Grid item xs={12} md={6} className="login-image-logo-container">
                    <img src="src/assets/logo-puc-minas.jpg" alt="Logo" />
                </Grid>
                <Grid item xs={12} md={6} className="register-form" sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <Typography variant="h4" className="register-title" gutterBottom>
                        Criar Instituição
                    </Typography>

                    <Box component="form" onSubmit={handleCreateInstituicao} sx={{ width: '100%' }}>
                        <Grid container spacing={1} sx={{ paddingLeft: '2rem', paddingRight: '2rem' }}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Nome da Instituição"
                                    margin="normal"
                                    variant="outlined"
                                    value={formData.nome || ''}
                                    onChange={(e) => handleChange('nome', e.target.value)}
                                    required
                                />
                            </Grid>
                            {/* <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Localização"
                                    margin="normal"
                                    variant="outlined"
                                    value={formData.localizacao || ''}
                                    onChange={(e) => handleChange('localizacao', e.target.value)}
                                    required
                                />
                            </Grid> */}
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
                                Criar Instituição
                            </Button>
                        </Box>
                    </Box>
                    {errorMessage && (
                        <Typography color="error" variant="body2" align="center">
                            {errorMessage}
                        </Typography>
                    )}
                </Grid>
            </Grid>
        </Container>
    );
};

export default CreateInstituicao;
