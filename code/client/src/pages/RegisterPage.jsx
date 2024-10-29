// src/pages/CadastroPage.js

import { useState, useEffect } from 'react';
import Register from '../components/Register';
import logo from '../assets/logo-puc-minas.jpg';
import AlunoService from '../services/AlunoService';
import CursoService from '../services/CursoService';

const RegisterPage = () => {
    
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        cpf: '',
        rg: '',
        endereco: '',
        instituicao: '',
        curso: '',
        senha: '',
    });

    const [loading, setLoading] = useState(false);
    const [cursos, setCursos] = useState([]);

    const handleChange = (field, value) => {
        setFormData({
            ...formData,
            [field]: value,
        });
    };

    const onFinish = async (e) => {
        e?.preventDefault();
        console.log('Cadastro enviado com:', formData);
        setLoading(true);

        try {
            const aluno = await AlunoService.createAluno(formData);
            console.log('Aluno criado com sucesso:', aluno);
        } catch (error) {
            console.error('Erro ao criar aluno:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchCursos = async () => {
            try {
                const cursosData = await CursoService.getAllCursos();
                setCursos(cursosData); // Atualiza o estado com os cursos
            } catch (error) {
                console.error('Erro ao buscar cursos:', error);
            }
        };

        fetchCursos();
    }, []);

    return (
        <Register
            logo={logo}
            formData={formData}
            handleChange={handleChange}
            loading={loading}
            onFinish={onFinish}
            cursos={cursos}
        />
    );
};

export default RegisterPage;
