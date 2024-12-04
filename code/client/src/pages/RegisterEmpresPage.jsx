// src/pages/CadastroPage.js
import { useState, useEffect } from 'react';
import RegisterEmpresa from '../components/RegisterEmpres';
import logo from '../assets/logo-puc-minas.jpg';
import EmpresService from '../services/EmpresService'; 

const CadastroPage = () => {
    
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        senha: '',
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
        console.log('Cadastro de empresa enviado com:', formData);
        setLoading(true);

        try {
            const empresa = await EmpresService.createEmpresa(formData); 
            console.log('Empresa criada com sucesso:', empresa);
        } catch (error) {
            console.error('Erro ao criar empresa:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <RegisterEmpresa
            logo={logo}
            formData={formData}
            handleChange={handleChange}
            loading={loading}
            onFinish={onFinish}
        />
    );
};

export default CadastroPage;
