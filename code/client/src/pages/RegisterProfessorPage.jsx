// src/pages/CadastroProfessorPage.js

import { useState, useEffect } from 'react';
import Register from '../components/RegisterProfessor';
import logo from '../assets/logo-puc-minas.jpg';
import ProfessorService from '../services/ProfessorService';
import CursoService from '../services/CursoService';
import InstituicaoService from '../services/InstituicaoService';

const CadastroProfessorPage = () => {
    
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
    const [instituicoes, setInstituicoes] = useState([]);

    const handleChange = (field, value) => {
        setFormData({
            ...formData,
            [field]: value,
        });
    };

    const onFinish = async (e) => {
        e?.preventDefault();
        console.log('Cadastro de professor enviado com:', formData);
        setLoading(true);

        try {
            const professor = await ProfessorService.createProfessor(formData);
            console.log('Professor cadastrado com sucesso:', professor);
        } catch (error) {
            console.error('Erro ao criar professor:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchCursos = async () => {
            try {
                const cursosData = await CursoService.getAllCursos();
                setCursos(cursosData); 
            } catch (error) {
                console.error('Erro ao buscar cursos:', error);
            }
        };

        const fetchInstituicoes = async () => {
            try {
                const instituicoesData = await InstituicaoService.getAllInstituicoes();
                setInstituicoes(instituicoesData);
            } catch (error) {
                console.error('Erro ao buscar instituições:', error);
            }
        };

        fetchCursos();
        fetchInstituicoes();
    }, []);

    return (
        <Register
            logo={logo}
            formData={formData}
            handleChange={handleChange}
            loading={loading}
            onFinish={onFinish}
            cursos={cursos}
            instituicoes={instituicoes}
        />
    );
};

export default CadastroProfessorPage;
