import { prismaClient } from '../database/prismaClient.js';

class VantagemService {
  async createVantagem(data) {
    const vantagem = await prismaClient.vantagem.create({
      data: {
        descricao: data.descricao,
        foto: data.foto,
        preco: data.preco,
        empresaId: data.empresaId,
      }
    });

    return vantagem;
  }

  async getVantagemById(id) {
    return prismaClient.vantagem.findUnique({
      where: { id },
      include: {
        empresa: true,
      }
    });
  }

  async getVantagens() {
    return prismaClient.vantagem.findMany({
      include: {
        empresa: true,
      }
    });
  }

  async updateVantagem(id, data) {
    const vantagem = await prismaClient.vantagem.update({
      where: { id },
      data: {
        descricao: data.descricao,
        foto: data.foto,
        preco: data.preco,
      }
    });

    return vantagem;
  }

  async deleteVantagem(id) {
    return prismaClient.vantagem.delete({
      where: { id }
    });
  }
}

export default new VantagemService();
