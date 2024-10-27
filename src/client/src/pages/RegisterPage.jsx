// src/pages/CadastroPage.js

import { useState } from 'react';
import Cadastro from '../components/Register';
import logo from '../assets/logo-puc-minas.jpg';

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

    const handleChange = (field, value) => {
        setFormData({
            ...formData,
            [field]: value,
        });
    };

    const onFinish = (e) => {
        e.preventDefault();
        console.log('Cadastro enviado com:', formData);
        setLoading(true);
        // Simulação de chamada à API
        setTimeout(() => {
            setLoading(false);
            // Redirecionar ou mostrar mensagem de sucesso
        }, 2000);
    };

    return (
        <Cadastro
            logo={logo}
            formData={formData}
            handleChange={handleChange}
            loading={loading}
            onFinish={onFinish}
        />
    );
};

export default RegisterPage;
