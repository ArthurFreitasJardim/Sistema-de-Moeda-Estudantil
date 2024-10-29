import CursoService from '../services/CursoService.js';

export class CursoController {
    
  async getAll(req, res) {
    try {
      const cursos = await CursoService.getAllCursos();
      return res.status(200).json(cursos);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar cursos.', error: error.message });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const curso = await CursoService.getCursoById(id);

      if (curso) {
        return res.status(200).json(curso);
      } else {
        res.status(404).json({ message: 'Curso não encontrado.' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar curso.', error: error.message });
    }
  }

  async create(req, res) {
    try {
      const cursoData = req.body;

      if (!cursoData.nome || !cursoData.cargaHoraria) {
        return res.status(400).json({ message: 'Campos obrigatórios: nome e cargaHoraria.' });
      }

      cursoData.duracao = parseInt(cursoData.duracao, 10);
      cursoData.creditos = parseInt(cursoData.creditos, 10);
      cursoData.cargaHoraria = parseInt(cursoData.cargaHoraria, 10);

      const newCurso = await CursoService.createCurso(cursoData);
      return res.status(201).json(newCurso);
    } catch (error) {
      res.status(500).json({ success: false, message: 'Erro ao criar curso.', error: error.message });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const cursoData = req.body;

      cursoData.duracao = parseInt(cursoData.duracao, 10);
      cursoData.creditos = parseInt(cursoData.creditos, 10);
      cursoData.cargaHoraria = parseInt(cursoData.cargaHoraria, 10);

      if (!cursoData.nome || !cursoData.cargaHoraria) {
        return res.status(400).json({ message: 'Campos obrigatórios: nome e cargaHoraria.' });
      }

      const updatedCurso = await CursoService.updateCurso(id, cursoData);
      return res.status(200).json(updatedCurso);
    } catch (error) {
      res.status(500).json({ success: false, message: 'Erro ao atualizar curso.', error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const { cursoId } = req.body;

      await CursoService.deleteCurso(cursoId);
      return res.status(204).json({ message: 'Curso deletado com sucesso.' });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao deletar curso.', error: error.message });
    }
  }
}
