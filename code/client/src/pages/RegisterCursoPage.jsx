import { useState, useEffect } from 'react';
import RegisterCourse from '../components/RegisterCurso'; 
import logo from '../assets/logo-puc-minas.jpg';
import CursoService from '../services/CursoService';


const RegisterCoursePage = () => {
    
    const [formData, setFormData] = useState({
        nome: '',
        descricao: '',
        cargaHoraria: '',
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (field, value) => {
        setFormData({
            ...formData,
            [field]: value,
        });
    };

    const onFinish = async (e) => {
        e?.preventDefault();
        console.log('Cadastro de curso enviado com:', formData);
        setLoading(true);

        try {
            const curso = await CursoService.createCurso(formData); 
            console.log('Curso criado com sucesso:', curso);
        } catch (error) {
            console.error('Erro ao criar curso:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <RegisterCourse
            logo={logo}
            formData={formData}
            handleChange={handleChange}
            loading={loading}
            onFinish={onFinish}
        />
    );
};

export default RegisterCoursePage;
