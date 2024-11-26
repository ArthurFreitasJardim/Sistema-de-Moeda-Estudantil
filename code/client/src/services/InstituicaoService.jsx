import axios from 'axios';

const API_URL = 'http://localhost:3000/api/instituicao';

class InstituicaoService {

  async getAllInstituicao() {
    try {
      const response = await axios.get(`${API_URL}/`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar instituicoes:', error);
      throw new Error('Não foi possível buscar instituicoes');
    }
  }
}

export default new InstituicaoService();