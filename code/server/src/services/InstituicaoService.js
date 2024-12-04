import { prismaClient } from '../database/prismaClient.js';

class InstituicaoService {

  async getAllInstituicoes() {
    try {
      return await prismaClient.instituicao.findMany();
    }catch (error) {
      console.error('Erro ao buscar instituição', error);
      throw new Error('Não foi possível buscar a instituição');
    }
    
  }

  async createInstituicao(data) {
    try {
      if (!data.nome) {
        throw new Error('Nome é obrigatório para criar uma instituição');
      }
      
      return await prismaClient.instituicao.create({ data });
    } catch (error) {
      console.error('Erro ao criar instituição:', error);
      throw new Error(`Não foi possível criar a instituição. Detalhes: ${error.message}`);
    }
  }

  async getInstituicaoById(id) {
    try {
      return await prismaClient.instituicao.findUnique({ where: { id } });
    } catch (error) {
      console.error('Erro ao buscar instituição', error);
      throw new Error('Não foi possível buscar a instituição');
    }
    
  }

  async updateInstituicao(id, data) {
    try {
      if (!id) {
        throw new Error('ID não fornecido');
      }
      if (!data.nome && !data.localizacao) {
        throw new Error('Dados para atualização não fornecidos');
      }

      const instituicao = await prismaClient.instituicao.update({
        where: { id },
        data,
      });

      return instituicao;
    } catch (error) {
      console.error('Erro ao atualizar instituição:', error);
      throw new Error(`Não foi possível atualizar a instituição. Detalhes: ${error.message}`);
    }
  }

  async deleteInstituicao(id) {
    try {
      if (!id) {
        throw new Error('ID não fornecido');
      }

      const instituicao = await prismaClient.instituicao.delete({ where: { id } });

      return instituicao;
    } catch (error) {
      console.error('Erro ao deletar instituição:', error);
      throw new Error(`Não foi possível deletar a instituição. Detalhes: ${error.message}`);
    }
  }

  async cadastrarProfessor(professorData) {
    try {
      if (!professorData.nome || !professorData.email) {
        throw new Error('Nome e email são obrigatórios para cadastrar um professor');
      }

      return await prismaClient.professor.create({ data: professorData });
    } catch (error) {
      console.error('Erro ao cadastrar professor:', error);
      throw new Error(`Não foi possível cadastrar o professor. Detalhes: ${error.message}`);
    }
  }

  async getAllInstituicoes() {
    try {
      return await prismaClient.instituicao.findMany();
    } catch (error) {
      console.error('Erro ao buscar instituições:', error);
      throw new Error(`Não foi possível buscar instituições. Detalhes: ${error.message}`);
    }
  }
}

export default new InstituicaoService();
