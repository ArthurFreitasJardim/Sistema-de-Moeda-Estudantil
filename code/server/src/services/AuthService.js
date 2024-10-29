import { prismaClient } from '../database/prismaClient.js';
import { Util } from '../util/Util.js';
import jwt from 'jsonwebtoken';

class AuthService {
    
    static async authenticate(email, senha) {
        const usuario = await prismaClient.usuario.findUnique({
            where: { email },
        });
    
        if (!usuario) {
            throw new Error('Usuário não encontrado.');
        }
    
        const isPasswordValid = Util.verifyPassword({ salt: usuario.senha_salt, hash: usuario.senha }, senha);
        if (!isPasswordValid) {
            throw new Error('Senha inválida.');
        }
    
        const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });
    
        const usuarioSeguro = {
            id: usuario.id,
            email: usuario.email,
            nome: usuario.nome,
            tipo: usuario.tipo
        };
    
        return { usuario: usuarioSeguro, token };
    }

    async requestPasswordReset(req, res) {
        try {
            const { email } = req.body;

            const emailService = new EmailService()

            const { resetToken, resetTokenExpiry, error } = await emailService.requestPasswordReset(email);

            res.status(200).json({
                success: true,
                message: 'Token de recuperação de senha enviado por e-mail',
                token: resetToken,
                resetTokenExpiry: resetTokenExpiry,
            });
    
        } catch (error) {
            console.error('Erro durante a solicitação de recuperação de senha:', error);
            res.status(500).json({ message: 'Erro durante a solicitação de recuperação de senha' });
        }
    }

    async resetPassword(req, res) {
        try {
            const { userAuthenticateId, token, password } = req.body;
    
            if (!userAuthenticateId || !token || !password) {
                return res.status(400).json({ success: false, message: 'Todos os campos são obrigatórios.' });
            }
    
            const emailService = new EmailService();
    
            const { success, message } = await emailService.resetPassword(
                parseInt(userAuthenticateId, 10),
                token,
                password
            );
    
            if (!success) {
                return res.status(400).json({ success: success, message: message });
            }
    
            res.status(200).json({ success: success, message: message }); // Código 200 para sucesso
        } catch (error) {
            console.error('Erro ao redefinir senha:', error); // Log do erro no servidor
            res.status(500).json({ success: false, message: 'Erro durante a redefinição de senha' });
        }
    }

}

export default AuthService;