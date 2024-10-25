import AlunoService from '../services/AlunoService.js';

export class AlunoController {

  async getAll(req, res) {
    try {
      const alunos = await AlunoService.getAllAlunos();
      return res.status(200).json(alunos);
    } catch (error) {
      res.status(500).json({
        message: 'Não foi possível recuperar os alunos. Tente novamente mais tarde.' + error,
      });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      
      const aluno = await AlunoService.getAlunoById(parseInt(id));
      return res.status(200).json(aluno);
    } catch (error) {
      res.status(400).json({
        message: 'Não foi possível buscar o aluno '+ id,
      });
    }
  }

  async create(req, res) {
    try {
      const data = req.body;
      const aluno = await AlunoService.createAluno(data);
      return res.status(201).json(aluno);
    } catch (error) {
      res.status(400).json({
        message: 'Não foi possível cadastrar a aluno.',
      });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;
      const aluno = await AlunoService.updateAluno(parseInt(id), data);
      return res.status(200).json(aluno);
    } catch (error) {
      res.status(400).json({
        message: 'Não foi possível atualizar aluno.',
      });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      console.log(id)
      await AlunoService.deleteAluno(id);
      return res.status(204).send();
    } catch (error) {
      res.status(400).json({
        message: 'Não foi possível excluir aluno.',
      });
    }
  }

  async consultarExtrato(req, res) {
    const { id } = req.params;
    const extrato = await AlunoService.consultarExtrato(id);
    return res.status(200).json(extrato);
  }

  async trocarMoeda(req, res) {
    const { id } = req.params;
    const { vantagemId, valor } = req.body;
    const resultado = await AlunoService.trocarMoeda(vantagemId, valor);
    return res.status(200).json(resultado);
  }

  async receberMoeda(req, res) {
    const { id } = req.params;
    const { valor } = req.body;
    const resultado = await AlunoService.receberMoeda(id, valor);
    return res.status(200).json(resultado);
  }
}
