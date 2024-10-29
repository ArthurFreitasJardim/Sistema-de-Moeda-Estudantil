import AuthService from '../services/AuthService.js';

export class AuthController {

    async login(req, res) {
        try {
            const { email, senha } = req.body;
    
            const { usuario, token } = await AuthService.authenticate(email, senha);
    
            if (!usuario || !usuario.id) {
                return res.status(400).json({ message: 'Usuário ou senha inválidos' });
            }
    
            req.session.user = usuario;
    
            return res.status(200).json({
                message: 'Login realizado com sucesso!',
                user: {
                    id: usuario.id,
                    email: usuario.email,
                    nome: usuario.nome,
                    tipo: usuario.tipo
                },
                token
            });
        } catch (error) {
            console.error('Erro no login:', error);
            return res.status(500).json({ message: 'Erro ao realizar login. Tente novamente mais tarde.' });
        }
    }
    

    async logout(req, res) {
        try {
            req.session.destroy(err => {
                if (err) {
                    return res.status(500).json({ message: 'Erro ao fazer logout.' });
                }
                return res.status(200).json({ message: 'Logout realizado com sucesso!' });
            });
        } catch (error) {
            console.error('Erro no logout:', error);
            return res.status(500).json({ message: 'Erro ao realizar logout. Tente novamente mais tarde.' });
        }
    }

    async checkSession(req, res) {
        try {
            if (req.session.user) {
                return res.status(200).json({ loggedIn: true, user: req.session.user });
            } else {
                return res.status(200).json({ loggedIn: false });
            }
        } catch (error) {
            console.error('Erro ao verificar sessão:', error);
            return res.status(500).json({ message: 'Erro ao verificar a sessão.' });
        }
    }
}