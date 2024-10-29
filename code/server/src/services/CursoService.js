import { prismaClient } from '../database/prismaClient.js';

class CursoService {
  async getAllCursos() {
    try {
      return await prismaClient.curso.findMany();
    } catch (error) {
      console.error('Erro ao buscar todos os cursos:', error);
      throw new Error('Não foi possível buscar os cursos');
    }
  }

  async getCursoById(id) {
    try {
      const curso = await prismaClient.curso.findUnique({
        where: { id: parseInt(id) },
        include: { cursoAluno: true },
      });

      if (!curso) {
        throw new Error(`Curso com id ${id} não encontrado`);
      }

      return curso;
    } catch (error) {
      console.error(`Erro ao buscar curso com id ${id}:`, error);
      throw error;
    }
  }

  async createCurso(cursoData) {
    try {
      const curso = await prismaClient.curso.create({
        data: cursoData,
      });
      return curso;
    } catch (error) {
      console.error('Erro ao criar curso:', error);
      throw new Error('Não foi possível criar o curso');
    }
  }

  async updateCurso(id, cursoData) {
    try {
      const curso = await prismaClient.curso.update({
        where: { id: parseInt(id) },
        data: cursoData,
      });

      if (!curso) {
        throw new Error(`Curso com id ${id} não encontrado`);
      }

      return curso;
    } catch (error) {
      console.error(`Erro ao atualizar curso com id ${id}:`, error);
      throw error;
    }
  }

  async deleteCurso(id) {
    try {
      const curso = await prismaClient.curso.delete({
        where: { id: parseInt(id) },
      });

      if (!curso) {
        throw new Error(`Curso com id ${id} não encontrado`);
      }

      return curso;
    } catch (error) {
      console.error(`Erro ao deletar curso com id ${id}:`, error);
      throw error;
    }
  }
}

export default new CursoService();