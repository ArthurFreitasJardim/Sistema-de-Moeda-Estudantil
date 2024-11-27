import { Container, Grid, Typography, Box, TextField, Button, CircularProgress, MenuItem, Select } from '@mui/material';
import { Link, useNavigate  } from 'react-router-dom';
import logo from '../assets/logo-puc-minas.jpg';
import '../styles/register.css';
import { useState, useEffect } from 'react';
import AlunoService from '../services/AlunoService'; // Certifique-se de que tem o método para registrar
import InstituicaoService from '../services/InstituicaoService';
import { useParams } from 'react-router-dom';

const Register = ({ formData = {}, handleChange, cursos = [] }) => {

    const navigate = useNavigate(); // Usando o hook useNavigate no lugar do useHistory
    const [isLoading, setIsLoading] = useState(false); // Estado de carregamento para o envio
    const [instituicao, setInstituicao] = useState(null)
    const [selecionado, setSelecionado] = useState(null)
    const [errorMessage, setErrorMessage] = useState(null);

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage(null);  // Limpa a mensagem de erro
    
        try {
            await AlunoService.createAluno(formData);
            navigate('/login');
        } catch (error) {
            console.error('Erro ao cadastrar aluno', error);
            setErrorMessage('Erro ao realizar cadastro. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    // Enquanto os dados não estiverem carregados, mostra uma tela de loading
    if (isLoading) {
        return <Typography>Carregando...</Typography>;
    }

    useEffect(() => {
        const fetchInstituicao = async () => {
            try {
                const instituicaoData = await InstituicaoService.getAllInstituicao();  // Certifique-se de passar o parâmetro correto
                setInstituicao(instituicaoData);  // Atualiza o estado com os dados da instituição
            } catch (error) {
                console.error('Erro ao buscar instituições', error);
            }
        };
    
        fetchInstituicao();
    }, []); // Adicione o array vazio para garantir que o efeito seja executado apenas uma vez
    

    return (
        <Container maxWidth="md" className="register-container">
            <Grid container spacing={2} style={{ height: '85vh' }}>
                <Grid item xs={12} md={6} className="login-image-logo-container">
                    <img src={logo} alt="Logo PUC Minas" />
                </Grid>
                <Grid item xs={12} md={6} className="register-form" sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <Typography variant="h4" className="register-title" gutterBottom>
                        Cadastro
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
                            {/* <Grid item xs={12} sm={12}>
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
                                    {instituicoes.map((instituicao) => (
                                        <MenuItem key={instituicao.id} value={instituicao.id}>
                                            {instituicao.nome}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid> */}
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
                                    {instituicao && instituicao.map((data) => (
                                        <MenuItem key={data.id} value={data.id}>
                                            {data.nome}
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
                <Alert onClose={handleToastClose} severity="success" sx={{ width: '100%' }}>
                    {toastMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default Register;
