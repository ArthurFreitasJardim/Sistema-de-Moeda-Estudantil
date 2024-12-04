import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import Login from '../components/Login';
import logo from '../assets/logo-puc-minas.jpg';
import '../styles/login.css';
import AuthService from '../services/AuthService';

const LoginPage = () => {
    const navigate = useNavigate();

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

    const onFinish = async () => {
        console.log('Login enviado com:', formData);
        setLoading(true);
    
        try {
            const response = await AuthService.login(formData.email, formData.senha);
    
            console.log('Resposta do login:', response);  // Verifique o que está sendo retornado
    
            if (response.token && response.user && response.user.id) {  // Verificando se o user.id existe
                toast.success('Login realizado com sucesso!');
    
                // Armazenar o ID da pessoa no localStorage
                localStorage.setItem('userId', response.user.id);
    
                // Navegar para a tela de dashboard, passando o ID através do state
                navigate('/dashboard', { state: { userId: response.user.id } });
            } else {
                toast.error('Erro ao realizar login: Credenciais inválidas.');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Erro ao realizar login.';
            console.error('Erro ao fazer login:', errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <>
            <Login
                logo={logo}
                formData={formData}
                handleChange={handleChange}
                loading={loading}
                onFinish={onFinish}
            />
            <ToastContainer /> 
        </>
    );
};

export default LoginPage;
