import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import VerticalAppBar from '../components/VerticalAppBar';
import { Grid, Paper, Typography, Button, IconButton } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CursoService from '../services/CursoService';
import '../styles/courses.css';

const CoursesPage = () => {
    const navigate = useNavigate();

    const [cursos, setCursos] = useState([]);
    const [loading, setLoading] = useState(false);

    // Função para buscar os cursos
    const fetchCursos = async () => {
        setLoading(true);
        try {
            const response = await CursoService.getAllCursos();
            setCursos(response);
        } catch (error) {
            console.error('Erro ao carregar cursos:', error);
        } finally {
            setLoading(false);
        }
    };

    // Função para editar curso
    const handleEdit = (cursoId) => {
        console.log(`Editar curso com ID: ${cursoId}`);
        navigate(`/edit-curso/${cursoId}`);
    };

    const handleDelete = async (id) => {
        try {
            await CursoService.deleteCurso(id);
            setCursos((prevCursos) => prevCursos.filter((curso) => curso.id !== id));
            console.log(`Curso com ID ${id} excluído com sucesso.`);
        } catch (error) {
            console.error(`Erro ao excluir curso com ID ${id}:`, error.message);
            alert('Ocorreu um erro ao tentar excluir o curso. Tente novamente mais tarde.');
        }
    };

    useEffect(() => {
        fetchCursos();
    }, []);

    return (
        <div>
            <VerticalAppBar />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingLeft: '30px', paddingRight: '40px' }}>
                <h1>Cursos</h1>
                <Button
                    sx={{ width: '300px', height: '3rem' }}
                    variant="contained"
                    color="primary"
                    startIcon={<SchoolIcon />}
                    onClick={() => navigate('/register-curso')}
                >
                    Adicionar Curso
                </Button>
            </div>

            <Grid container spacing={3} id="courses-conteiner">
                {loading ? (
                    <Typography variant="body1" sx={{ margin: '2rem' }}>
                        Carregando cursos...
                    </Typography>
                ) : cursos && cursos.length > 0 ? (
                    cursos.map((curso) => (
                        <Grid item md={4} key={curso.id}>
                            <Paper
                                elevation={3}
                                sx={{
                                    backgroundColor: '#FAF9F6',
                                    border: '1px solid #e0e0e0',
                                    borderRadius: '12px',
                                    height: '12vh', 
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    padding: '12px', 
                                    transition: 'transform 0.2s',
                                    '&:hover': {
                                        transform: 'scale(1.05)',
                                    },
                                }}
                            >
                                <div>
                                    <Typography variant="h6" sx={{ marginBottom: '8px' }}>
                                        <i className={curso.icon}></i> {curso.nome}
                                    </Typography>
                                    <Typography variant="body2" sx={{ marginBottom: '8px' }}>
                                        Código: {curso.nome.slice(0, 3).toUpperCase() + curso.id}
                                    </Typography>
                                    <Typography variant="body2">
                                        {curso.descricao}
                                    </Typography>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                    <IconButton
                                        color="primary"
                                        onClick={() => handleEdit(curso.id)}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        color="error"
                                        onClick={() => handleDelete(curso.id)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </div>
                            </Paper>
                        </Grid>
                    ))
                ) : (
                    <Grid item xs={12}>
                        <Typography variant="body1">Nenhum curso disponível.</Typography>
                    </Grid>
                )}
            </Grid>
        </div>
    );
};

export default CoursesPage;
