// src/servicesService.js

import axios from 'axios';

const API_URL = 'http://localhost:3000/api/curso/';

class CursoService {
  async getAllCursos() {
    try {
      const response = await axios.get(`${API_URL}`);
      return response.data;
    } catch (error) {
      throw error.response.data || 'Erro ao buscar cursos.';
    }
  }

  async getCursoById(id) {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw error.response.data || 'Erro ao buscar curso.';
    }
  }

  async createCurso(cursoData) {
    try {
      const response = await axios.post(`${API_URL}`, cursoData);
      return response.data;
    } catch (error) {
      throw error.response.data || 'Erro ao criar curso.';
    }
  }

  async updateCurso(id, cursoData) {
    try {
      const response = await axios.put(`${API_URL}/${id}`, cursoData);
      return response.data;
    } catch (error) {
      throw error.response.data || 'Erro ao atualizar curso.';
    }
  }

  async deleteCurso(id) {
    console.log('ID enviado para exclusão:', id); 
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        console.log('Curso excluído com sucesso:', response.data);
        return response.data;
    } catch (error) {
        console.error('Erro ao excluir curso:', error.response?.data || error.message);
        throw error.response?.data || 'Erro ao deletar curso.';
    }
}

}

export default new CursoService();
