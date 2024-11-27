/* eslint-disable no-unused-vars */
import { useState } from 'react';
import Login from '../components/Login';
import logo from '../assets/logo-puc-minas.jpg';
import '../styles/login.css';

const LoginPage = () => {

    const [formData, setFormData] = useState({
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

    const onFinish = () => {
        console.log('Login enviado com:', formData);
    };

    return (
        <Login
            logo={logo}
            formData={formData}
            handleChange={handleChange}
            loading={loading}
            onFinish={onFinish}
        />
    );
};

export default LoginPage;