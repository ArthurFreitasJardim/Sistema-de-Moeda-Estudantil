/* eslint-disable react/prop-types */

import { Container, Grid, Typography, Box, TextField, Button, CircularProgress } from '@mui/material';
import { useState } from 'react';
import '../styles/login.css';

const RecoverPassword = ({ logo, loading, onFinish }) => {
    const [formData, setFormData] = useState({ email: '', senha: '' });

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <Container
            maxWidth="md"
            className="login-container"
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
                    className="login-form"
                >
                    <Box
                        component="form"
                        onSubmit={(e) => {
                            e.preventDefault();
                            onFinish(formData);
                        }}
                        sx={{ width: '100%', padding: '5rem' }}
                    >

                        <Typography variant="h4" gutterBottom className='login-title'>
                            Recuperar Senha
                        </Typography>

                        <TextField
                            fullWidth
                            label="E-mail"
                            type="email"
                            margin="normal"
                            variant="outlined"
                            value={formData.email}
                            onChange={(e) => handleChange('email', e.target.value)}
                            required
                        />
                        <Box mt={2} mb={1}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                disabled={loading}
                                startIcon={loading && <CircularProgress size={20} color="inherit" />}
                            >
                                Enviar
                            </Button>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
};

export default RecoverPassword;
