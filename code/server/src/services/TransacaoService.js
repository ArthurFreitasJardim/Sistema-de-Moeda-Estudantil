import { prismaClient } from '../database/prismaClient.js';

import ProfessorService from '../services/ProfessorService.js';
import AlunoService from '../services/AlunoService.js';
import EmpresaService from '../services/EmpresaService.js';

class TransacaoService {

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

      const aluno = await AlunoService.getAlunoById(data.alunoId);
      const professor = await ProfessorService.getProfessorById(data.professorId);

      if (!aluno || !professor) {
        throw new Error('Usuario não encontrado.');
      }

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

  async enviarMoedas(data) {
    return await prismaClient.$transaction(async (prisma) => {
        // Atualiza o saldo do professor (deduz o valor)
        const professor = await prisma.professor.update({
            where: { id: data.professorId },
            data: { saldo: { decrement: data.numMoedas } },
        });
        
        // Atualiza o saldo do aluno (acrescenta o valor)
        const aluno = await prisma.aluno.update({
            where: { id: data.alunoId },
            data: { saldo: { increment: data.numMoedas } },
        });
        
        // Registra a transação
        const transacao = await prisma.transacao.create({
            data: {
                numMoedas: data.numMoedas,
                tipo: 'ENVIO',
                data: new Date(),
                professorId: data.professorId,
                alunoId: data.alunoId,
                motivo: data.motivo,
            }
        });
        
        return { professor, aluno, transacao };
    });
}
}

export default new TransacaoService();
