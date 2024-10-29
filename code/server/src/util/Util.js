import crypto from 'crypto';

export class Util {

    static encryptPassword(password) {
        const salt = crypto.randomBytes(16).toString('hex');
        const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
        return { salt, hash };
    }
    
    static verifyPassword(encryptedPassword, userPassword) {
    
        if (!encryptedPassword || !encryptedPassword.salt || !encryptedPassword.hash) {
            throw new Error('Objeto de senha criptografada inválido');
        }
    
        const { salt, hash } = encryptedPassword;

        const userHash = crypto.pbkdf2Sync(userPassword, salt, 10000, 64, 'sha512').toString('hex');

        return userHash === hash;
    }
}