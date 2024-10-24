import { prismaClient } from '../database/prismaClient.js';

class ProfessorService {

  async createProfessor(data) {
    // Cria o usuário genérico na tabela Usuario
    const usuario = await prismaClient.usuario.create({
      data: {
        nome: data.nome,
        login: data.login,
        senha: data.senha,
        tipo: 'PROFESSOR',
      }
    });

    // Cria os dados específicos de professor e vincula ao usuário
    const professor = await prismaClient.professor.create({
      data: {
        saldo: data.saldo,
        cpf: data.cpf,
        usuarioId: usuario.id,
      }
    });

    return { usuario, professor };
  }

  async getProfessorById(id) {
    return prismaClient.professor.findUnique({
      where: { id },
      include: { usuario: true },
    });
  }

  async updateProfessor(id, data) {
    // Atualiza os dados do professor e, se necessário, do usuário
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
  }

  async deleteProfessor(id) {
    // Deleta o professor e o usuário associado
    const professor = await prismaClient.professor.delete({
      where: { id }
    });

    await prismaClient.usuario.delete({
      where: { id: professor.usuarioId }
    });

    return professor;
  }

  async consultarExtrato(id) {
    return await prismaClient.transacao.findMany({
      where: { professorId: id },
    });
  }

  async enviarMoedas(alunoId, valor) {
    // Transferir moedas para o aluno
    return await prismaClient.aluno.update({
      where: { id: alunoId },
      data: {
        saldo: { increment: valor },
      },
    });
  }
}

export default new ProfessorService();
