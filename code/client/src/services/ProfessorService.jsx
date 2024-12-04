import axios from 'axios';

const API_URL = 'http://localhost:3000/api/professor';

class ProfessorService {

  async getAllProfessores() {
    try {
      const response = await axios.get(`${API_URL}`);
      return response.data;  
    } catch (error) {
      console.error('Erro ao buscar todos os professores:', error);
      throw new Error('Não foi possível buscar os professores');
    }
  }

  async createProfessor(data) {
    console.log(data)
    try {
      const response = await axios.post(`${API_URL}`, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar professor:', error);
      throw new Error('Não foi possível criar o professor');
    }
  }  

  async getProfessorById(id) {
    try {
      console.log('ID enviado:', id);
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro aq ao buscar professor com ID ${id}:`, error);
      throw new Error('Não foi possível buscar o professor');
    }
  }

  async consultarExtrato(id) {
    try {
      const response = await axios.get(`${API_URL}/${id}/extrato`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao consultar extrato do aluno com ID ${id}:`, error);
      throw new Error('Não foi possível consultar o extrato');
    }
  }

  async trocarMoeda(id, vantagemId, valor) {
    try {
      const response = await axios.post(`${API_URL}/${id}/trocar-moeda`, {
        vantagemId,
        valor
      });
      return response.data;
    } catch (error) {
      console.error(`Erro ao trocar moeda para o aluno com ID ${id}:`, error);
      throw new Error('Não foi possível realizar a troca de moeda');
    }
  }

  async receberMoeda(id, valor) {
    try {
      const response = await axios.post(`${API_URL}/${id}/receber-moeda`, { valor });
      return response.data;
    } catch (error) {
      console.error(`Erro ao adicionar moedas para o aluno com ID ${id}:`, error);
      throw new Error('Não foi possível adicionar moedas');
    }
  }
}

export default new ProfessorService();
