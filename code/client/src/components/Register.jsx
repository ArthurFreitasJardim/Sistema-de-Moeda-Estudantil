// src/components/Register.js

/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { Container, Grid, Typography, Box, TextField, Button, CircularProgress, MenuItem } from '@mui/material';
import { Link } from 'react-router-dom';
import logo from '../assets/logo-puc-minas.jpg';
import '../styles/register.css';

const Register = ({ formData = {}, handleChange, loading, onFinish, cursos = [] }) => {
    return (
        <Container 
            maxWidth="md"
            className="register-container"
        >
            <Grid container spacing={2} style={{ height: '85vh' }}>
                <Grid
                    item
                    xs={12}
                    md={6}
                    className="login-image-logo-container"
                >
                    <img
                        src={logo}
                        alt="Logo PUC Minas"
                    />
                </Grid>
                <Grid
                    item
                    xs={12}
                    md={6}
                    className="register-form"
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Typography variant="h4" className="register-title" gutterBottom>
                        Cadastro
                    </Typography>

                    <Box
                        component="form"
                        onSubmit={(e) => {
                            e.preventDefault();
                            onFinish();
                        }}
                        sx={{ width: '100%' }}
                    >
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
                                    label="E-mail"
                                    type="email"
                                    margin="normal"
                                    variant="outlined"
                                    value={formData.email || ''}
                                    onChange={(e) => handleChange('email', e.target.value)}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="CPF"
                                    margin="normal"
                                    variant="outlined"
                                    value={formData.cpf || ''}
                                    onChange={(e) => handleChange('cpf', e.target.value)}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="RG"
                                    margin="normal"
                                    variant="outlined"
                                    value={formData.rg || ''}
                                    onChange={(e) => handleChange('rg', e.target.value)}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Endereço"
                                    margin="normal"
                                    variant="outlined"
                                    value={formData.endereco || ''}
                                    onChange={(e) => handleChange('endereco', e.target.value)}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
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
                                    <MenuItem value="PUC Minas">PUC Minas</MenuItem>
                                    <MenuItem value="Outra">Outra</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Curso"
                                    margin="normal"
                                    variant="outlined"
                                    value={formData.curso || ''}
                                    onChange={(e) => handleChange('curso', e.target.value)}
                                    required
                                >
                                    {cursos.map((curso) => (
                                        <MenuItem key={curso.id} value={curso.nome}>
                                            {curso.nome}
                                        </MenuItem>
                                    ))}
                                </TextField>
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
                                disabled={loading}
                                startIcon={loading && <CircularProgress size={20} color="inherit" />}
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
        </Container>
    );
};

export default Register;
