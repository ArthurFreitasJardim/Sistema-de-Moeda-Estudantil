import { prismaClient } from '../database/prismaClient.js';

import ProfessorService from '../services/ProfessorService.js';
import AlunoService from '../services/AlunoService.js';
import EmpresaService from '../services/EmpresaService.js';

class TransacaoService {

  gerarCupom() {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${timestamp}-${randomStr}`;
  };

  // async transacaoEnvio(data) {
  //   try {

  //     const aluno = await AlunoService.getAlunoById(data.alunoId);
  //     const professor = await ProfessorService.getProfessorById(data.professorId);

  //     if (!aluno || !professor) {
  //       throw new Error('Usuario não encontrado.');
  //     }

  //     const transacao = prismaClient.transacao.create({
  //       data: {
  //         alunoId: data.alunoId,
  //         professorId: data.professorId,
  //         numMoedas: data.numMoedas,
  //         tipo: "ENVIO",
  //         cupom: data.cupom,
  //         motivo: data.motivo,
  //       }
  //     })

  //     return transacao;
  //   } catch (error) {
  //     console.error('Erro ao enviar moedas do professor ao aluno', error);
  //     throw new Error('Não foi possível enviar moedas do professor ao aluno', error);
  //   }
  // }

  // async transacaoTroca(data) {
  //   try {
  //     const transacao = prismaClient.transacao.create({
  //       data: {
  //         alunoId: data.alunoId,
  //         empresaId: data.empresaId,
  //         numMoedas: data.numMoedas,
  //         tipo: "TROCA",
  //       }
  //     })

  //     return transacao;
  //   } catch (error) {
  //     console.error('Erro ao fazer troca entre aluno e empresa', error);
  //     throw new Error('Não foi possível realizar a troca entre aluno e empresa', error);
  //   }
  // }

  async recarga(data) {
    try {

      const id = data.professorId;
      const professorExiste = await prismaClient.professor.findUnique({
        where: { id: id },
      });

      if (!professorExiste) {
        throw new Error('Professor não encontrado.');
      }

      return await prismaClient.$transaction(async () => {

        
        const professor = await prismaClient.professor.update({
            where: { id: parseInt(data.professorId) },
            data: { saldo: { increment: parseInt(data.numMoedas) } },
        });
        
        const transacao = await prismaClient.transacao.create({
            data: {
                numMoedas: data.numMoedas,
                tipo: 'RECARGA',
                professorId: data.professorId,
            }
        });
        
        return { professor, transacao };
    });
    } catch (error) {
      console.error('Erro ao enviar moedas do professor ao aluno', error);
      throw new Error('Não foi possível enviar moedas do professor ao aluno', error);
    }
  }

  async enviar(data) {
    try {
        console.log('Dados recebidos no método enviar:', data);

        const professorId = parseInt(data.professorId, 10);
        const alunoId = parseInt(data.alunoId, 10);
        const moedas = parseInt(data.numMoedas, 10);

        // Validações
        if (isNaN(professorId) || isNaN(alunoId)) {
            throw new Error('IDs inválidos: Certifique-se de que os IDs do professor e do aluno são números.');
        }
        if (isNaN(moedas) || moedas <= 0) {
            throw new Error('Número de moedas inválido: Deve ser um número maior que zero.');
        }

        if (!data.motivo || typeof data.motivo !== 'string') {
            throw new Error('Motivo inválido: O motivo deve ser uma string não vazia.');
        }

        return await prismaClient.$transaction(async () => {
            // Atualização do saldo do professor
            const professor = await prismaClient.professor.update({
                where: { id: professorId },
                data: { saldo: { decrement: moedas } },
            });

            // Atualização do saldo do aluno
            const aluno = await prismaClient.aluno.update({
                where: { id: alunoId },
                data: { saldo: { increment: moedas } },
            });

            // Criação da transação
            const transacao = await prismaClient.transacao.create({
                data: {
                    numMoedas: moedas,
                    tipo: 'ENVIO',
                    professorId,
                    alunoId,
                    motivo: data.motivo,
                },
            });

            return { professor, aluno, transacao };
        });
    } catch (error) {
        console.error('Erro ao realizar a transação', error);
        throw new Error('Não foi possível realizar a transação');
    }
}


  async trocar(data) {
    try {
      return await prismaClient.$transaction(async (prisma) => {
        // Verificar se o aluno existe e tem saldo suficiente
        const aluno = await prisma.aluno.findUnique({
          where: { id: data.alunoId },
          select: { saldo: true },
        });
  
        if (!aluno) {
          throw new Error('Aluno não encontrado.');
        }

        console.log(aluno.saldo)
  
        if (aluno.saldo < data.numMoedas) {
          throw new Error('Saldo insuficiente para realizar a troca.');
        }
  
        // Verificar se a vantagem existe
        const vantagem = await prisma.vantagem.findUnique({
          where: { id: data.vantagemId },
        });
  
        if (!vantagem) {
          throw new Error('Vantagem não encontrada.');
        }
  
        // Verificar se a empresa existe
        const empresa = await prisma.empresa.findUnique({
          where: { id: data.empresaId },
        });
  
        if (!empresa) {
          throw new Error('Empresa não encontrada.');
        }
  
        // Atualizar o saldo do aluno e conectar vantagem
        const alunoAtualizado = await prisma.aluno.update({
          where: { id: data.alunoId },
          data: {
            saldo: { decrement: data.numMoedas },
            vantagens: {
              connect: { id: data.vantagemId },
            },
          },
        });
  
        // Registrar a transação
        const transacao = await prisma.transacao.create({
          data: {
            numMoedas: data.numMoedas,
            tipo: 'TROCA',
            empresaId: data.empresaId,
            cupom: this.gerarCupom(),
            alunoId: data.alunoId,
          },
        });
  
        return { aluno: alunoAtualizado, transacao };
      });
    } catch (error) {
      console.error('Erro na troca de moedas:', error.message);
      throw new Error(`Erro ao realizar a troca de moedas: ${error.message}`);
    }
  }
  

}

export default new TransacaoService();
