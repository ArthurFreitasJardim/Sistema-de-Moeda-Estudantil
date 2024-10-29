/* eslint-disable no-unused-vars */
import { useState } from 'react';
import VerticalAppBar from '../components/VerticalAppBar';
import { Grid, Paper, Typography, Button } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import '../styles/courses.css';

const CoursesPage = () => {
    const [cursos, setCursos] = useState([
        { id: 1, nome: 'Engenharia de Software', descricao: 'Curso de formação em Engenharia de Software.', icon: 'fas fa-laptop-code' },
        { id: 2, nome: 'Ciência da Computação', descricao: 'Curso voltado para ciência da computação.', icon: 'fas fa-code' },
        { id: 3, nome: 'Sistemas de Informação', descricao: 'Curso de Sistemas de Informação focado em gestão.', icon: 'fas fa-database' },
    ]);

    const handleAdd= () => {
        console.log('teste');
    }

    return (
        <div>
            <VerticalAppBar />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingLeft: '30px', paddingRight: '40px' }}>
                <h1>Cursos</h1>
                <Button
                    sx={{width: '300px', height: '3rem'}}
                    variant="contained"
                    color="primary"
                    startIcon={<SchoolIcon />}
                    onClick={handleAdd}
                >
                    Adicionar Curso
                </Button>
            </div>

            <Grid container spacing={3} id="courses-conteiner">
                {cursos && cursos.length > 0 ? (
                    cursos.map((curso) => (
                        <Grid item md={4} key={curso.id}>
                            <a href={`/curso/${curso.id}`} className="card-link">
                                <Paper
                                    elevation={3}
                                    sx={{
                                        backgroundColor: '#FAF9F6',
                                        border: '1px solid #e0e0e0',
                                        borderRadius: '12px',
                                        cursor: 'pointer',
                                        height: '30vh',
                                        transition: 'transform 0.2s',
                                        '&:hover': {
                                            transform: 'scale(1.05)',
                                        },
                                    }}
                                >
                                    <div className="card-body" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
                                        <Typography variant="h5" className="card-title">
                                            <i className={curso.icon}></i> {curso.nome}
                                        </Typography>
                                        <Typography variant="h6" className="card-subtitle" style={{ marginBottom: '0.5rem' }}>
                                            Código: {curso.nome.slice(0, 3).toUpperCase() + curso.id}
                                        </Typography>
                                        <Typography variant="body2" className="card-text">
                                            {curso.descricao}
                                        </Typography>
                                    </div>
                                </Paper>
                            </a>
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
