import axios from 'axios';


const API_URL = 'http://localhost:3000/api/empresa';

class AlunoService {

  async createEmpresa(data) {
    console.log(data)
    try {
      const response = await axios.post(`${API_URL}`, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar empresa:', error);
      throw new Error('Não foi possível criar a empresa');
    }
  }

  async getAllEmpresas() {
    try {
      const response = await axios.get(`${API_URL}`);
      return response.data;  
    } catch (error) {
      console.error('Erro ao buscar todos as empresas:', error);
      throw new Error('Não foi possível buscar as empresas');
    }
  }
}

export default new AlunoService();
