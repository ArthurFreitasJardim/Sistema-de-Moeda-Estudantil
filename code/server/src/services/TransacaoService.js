import { prismaClient } from '../database/prismaClient.js';

import ProfessorService from '../services/ProfessorService.js';


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

  async getTransacaoById(usuarioId) {
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

  async transacaoRecarga(id, numMoedas) {
    try {

      const professor = await ProfessorService.getProfessorById(id);

      if (!professor) {
        throw new Error('Professor não encontrado.');
      }

      if (professor.saldo < numMoedas) {
        throw new Error('Saldo insuficiente para realizar a transação.');
      }

      const transacao = prismaClient.transacao.create({
        data: {
          professorId: id,
          numMoedas: numMoedas,
          tipo: "ENVIO",
          data: new Date(),
        }
      })

      return transacao;
    } catch (error) {
      console.error('Erro ao enviar moedas do professor ao aluno', error);
      throw new Error('Não foi possível enviar moedas do professor ao aluno', error);
    }
  }

  async transacaoEnvio(data) {
    try {
      const transacao = prismaClient.transacao.create({
        data: {
          alunoId: data.alunoId,
          professorId: data.professorId,
          numMoedas: data.numMoedas,
          tipo: "ENVIO",
          data: new Date(),
          cupom: data.cupom,
          motivo: data.motivo,
        }
      })

      return transacao;
    } catch (error) {
      console.error('Erro ao enviar moedas do professor ao aluno', error);
      throw new Error('Não foi possível enviar moedas do professor ao aluno', error);
    }
  }

  async transacaoTroca(data) {
    try {
      const transacao = prismaClient.transacao.create({
        data: {
          alunoId: data.alunoId,
          empresaId: data.empresaId,
          numMoedas: data.numMoedas,
          tipo: "TROCA",
          data: new Date(),
        }
      })

      return transacao;
    } catch (error) {
      console.error('Erro ao fazer troca entre aluno e empresa', error);
      throw new Error('Não foi possível realizar a troca entre aluno e empresa', error);
    }
  }
}

export default new TransacaoService();
