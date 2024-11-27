import { prismaClient } from '../database/prismaClient.js';
import { Util } from '../util/Util.js';

class ProfessorService {

  async getAllProfessores() {
    try {
      return await prismaClient.professor.findMany({
        include: { usuario: true },
      });
    } catch (error) {
      throw new Error('Erro ao buscar os professores: ' + error.message);
    }
  }

  async getProfessorById(professorId) {
    try {

      const id = parseInt(professorId)

      return await prismaClient.professor.findUnique({
        where: { id },
        include: { usuario: true },
      });
    } catch (error) {
      throw new Error('Erro ao buscar o professor com o ID ' + id + ': ' + error.message);
    }
  }

  async createProfessor(data) {
    try {
      console.log('Dados recebidos:', data);
  
      if (!data.senha) throw new Error('Senha não fornecida.');
  
      const { hash, salt } = Util.encryptPassword(data.senha);
      console.log('Hash gerado:', hash);
  
      const professor = await prismaClient.professor.create({
        data: {
          saldo: 1000,
          cpf: data.cpf,
          instituicao: {
            connect: { id: data.instituicaoId }
          },
          usuario: {
            create: {
              nome: data.nome,
              login: data.login,
              senha: hash,
              senha_salt: salt,
              tipo: 'PROFESSOR',
            }
          }
        }
      });
  
      console.log('Professor criado:', professor);
      return professor;
    } catch (error) {
      console.error('Erro no createProfessor:', error.message);
      throw new Error('Erro ao criar o professor: ' + error.message);
    }
  }
  

  async updateProfessor(id, data) {
    try {
      const professor = await prismaClient.professor.update({
        where: { id },
        data: {
          saldo: data.saldo,
          cpf: data.cpf,
        }
      });

      if (data.usuario) {
        await prismaClient.usuario.update({
          where: { id: professor.usuarioId },
          data: data.usuario
        });
      }

      return professor;
    } catch (error) {
      throw new Error('Erro ao atualizar o professor com o ID ' + id + ': ' + error.message);
    }
  }

  async deleteProfessor(professorId) {
    try {
      const id = parseInt(professorId)
      const professor = await this.getProfessorById(id);

      await prismaClient.usuario.delete({ where: { id: professor.usuarioId } });

      return professor;
    } catch (error) {
      console.error('Erro ao deletar professor', error);
      throw new Error('Não foi possível deletar professor');
    }
  }

  async consultarExtratoProfessor(id) {
    try {
      return await prismaClient.transacao.findMany({
        where: { professorId: id },
        include: { transacao: true },
      });
    } catch (error) {
      throw new Error('Erro ao consultar o extrato do professor com o ID ' + id + ': ' + error.message);
    }
  }

  async debitar(id, valor) {
    try {
      var professor = this.getProfessorById(id);

      if (!professor) {
        throw new Error('Professor não encontrado');
      }

      if (professor.saldo < valor) {
        throw new Error('Saldo insuficiente');
      }

      professor = await prismaClient.professor.update({
        where: { id: id },
        data: {
          saldo: { decrement: valor },
        },
      });

      return professor;
    } catch (error) {
      throw new Error('Erro ao remover moedas do professor com o ID' + id + ':' + error);
    }

  }

  async recarga(id, valor) {
    try {

      const professorId = parseInt(id);
      const valorMoedas = parseInt(valor);

      const professor = this.getProfessorById(professorId);

      if (!professor) {
        throw new Error('Professor não encontrado');
      }

      return await prismaClient.professor.update({
        where: { id: professorId },
        data: {
          saldo: { increment: valorMoedas },
        },
      });
    } catch (error) {
      throw new Error('Erro ao enviar moedas para o professor com o ID ' + professorId + ': ' + error);
    }
  }
}

export default new ProfessorService();
