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
    return await prismaClient.instituicao.create({ data });
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
    return await prismaClient.instituicao.update({
      where: { id },
      data,
    });
  }

  async deleteInstituicao(id) {
    return await prismaClient.instituicao.delete({ where: { id } });
  }

  async cadastrarProfessor(professorData) {
    return await prismaClient.professor.create({ data: professorData });
  }
}

export default new InstituicaoService();
