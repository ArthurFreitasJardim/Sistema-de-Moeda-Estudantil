import { prismaClient } from '../database/prismaClient.js';

class TransacaoService {
  async createTransacao(data) {
    const transacao = await prismaClient.transacao.create({
      data: {
        numMoedas: data.numMoedas,
        tipo: data.tipo,
        data: data.data,
        cupom: data.cupom,
        alunoId: data.alunoId,
        professorId: data.professorId,
      }
    });

    return transacao;
  }

  async getTransacaoById(id) {
    return prismaClient.transacao.findUnique({
      where: { id },
      include: {
        aluno: true,
        professor: true,
      },
    });
  }

  async getTransacoes() {
    return prismaClient.transacao.findMany({
      include: {
        aluno: true,
        professor: true,
      },
    });
  }

  async deleteTransacao(id) {
    return prismaClient.transacao.delete({
      where: { id }
    });
  }
}

export default new TransacaoService();
