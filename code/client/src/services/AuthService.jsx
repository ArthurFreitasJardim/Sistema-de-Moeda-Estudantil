import axios from 'axios';
import { API_URL} from '../config/config.jsx'

class AuthService {

    async login(email, senha) {
        console.log(email)
        return axios.post(`${API_URL}/login`, { email, senha })
            .then(response => {
                console.log(response.data.token)
                if (response.data.token) {
                    localStorage.setItem('token', response.data.token);
                    localStorage.setItem('user', JSON.stringify(response.data.user));
                    return response.data;
                }
            })
            .catch(error => {
                throw error;
            });
    }

    logout() {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    }

    isLoggedIn() {
        const token = localStorage.getItem('token');
        return token ? true : false;
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem('user'));
    }

    isSessionExpired() {
        const token = localStorage.getItem('token');
        if (!token) return true;

        const payload = JSON.parse(atob(token.split('.')[1]));
        const exp = payload.exp * 1000;
        return Date.now() >= exp;
    }

    async recoverPassword(email) {
        return await axios.post(`${API_URL}/usuario/recover-password`, email)
            .then(response => response.data)
            .catch(error => {
                throw error;
            });
    }

    async resetPassword(data) {
        return await axios.post(`${API_URL}/usuario/reset-password`, data)
            .then(response => response.data)
            .catch(error => {
                throw error;
            });
    }

}

export default new AuthService();