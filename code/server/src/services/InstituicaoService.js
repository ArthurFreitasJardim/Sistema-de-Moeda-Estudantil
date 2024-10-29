import { prismaClient } from '../database/prismaClient.js';

class InstituicaoService {
  async createInstituicao(data) {
    return await prismaClient.instituicao.create({ data });
  }

  async getInstituicaoById(id) {
    return await prismaClient.instituicao.findUnique({ where: { id } });
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
