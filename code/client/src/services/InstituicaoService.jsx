import axios from 'axios';

const API_URL = 'http://localhost:3000/api/instituicao';

class InstituicaoService {

  async getAllInstituicao() {
    try {
      const response = await axios.get(`${API_URL}/`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar instituições:', error);
      throw new Error('Não foi possível buscar as instituições');
    }
  }

  async getInstituicaoById(id) {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar instituição com ID ${id}:`, error);
      throw new Error('Não foi possível buscar a instituição');
    }
  }

  async createInstituicao(data) {
    try {
      const response = await axios.post(`${API_URL}`, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar instituição:', error);
      throw new Error('Não foi possível criar a instituição');
    }
  }

  async updateInstituicao(id, data) {
    try {
      const response = await axios.put(`${API_URL}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar instituição com ID ${id}:`, error);
      throw new Error('Não foi possível atualizar a instituição');
    }
  }

  async deleteInstituicao(id) {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao deletar instituição com ID ${id}:`, error);
      throw new Error('Não foi possível deletar a instituição');
    }
  }

  async cadastrarProfessor(data) {
    try {
      const response = await axios.post(`${API_URL}/professor`, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao cadastrar professor:', error);
      throw new Error('Não foi possível cadastrar o professor');
    }
  }
}

export default new InstituicaoService();
