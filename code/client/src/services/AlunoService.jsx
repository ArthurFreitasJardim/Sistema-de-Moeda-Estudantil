import axios from 'axios';

const API_URL = 'http://localhost:3000/api/aluno';

class AlunoService {

  async getAllAlunos() {
    try {
      const response = await axios.get(`${API_URL}/`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar alunos:', error);
      throw new Error('Não foi possível buscar alunos');
    }
  }

  async getAlunoById(id) {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar aluno com ID ${id}:`, error);
      throw new Error('Não foi possível buscar o aluno');
    }
  }

  async createAluno(data) {
    try {
      const response = await axios.post(`${API_URL}`, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar aluno:', error);
      throw new Error('Não foi possível criar o aluno');
    }
  }

  async updateAluno(id, data) {
    try {
      const response = await axios.put(`${API_URL}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar aluno com ID ${id}:`, error);
      throw new Error('Não foi possível atualizar o aluno');
    }
  }

  async deleteAluno(id) {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao deletar aluno com ID ${id}:`, error);
      throw new Error('Não foi possível deletar o aluno');
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

export default new AlunoService();
