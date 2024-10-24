import AlunoService from '../services/AlunoService.js';

export class AlunoController {
  async create(req, res) {
    const data = req.body;
    const aluno = await AlunoService.createAluno(data);
    return res.status(201).json(aluno);
  }

  async getById(req, res) {
    const { id } = req.params;
    const aluno = await AlunoService.getAlunoById(id);
    return res.status(200).json(aluno);
  }

  async update(req, res) {
    const { id } = req.params;
    const data = req.body;
    const aluno = await AlunoService.updateAluno(id, data);
    return res.status(200).json(aluno);
  }

  async delete(req, res) {
    const { id } = req.params;
    await AlunoService.deleteAluno(id);
    return res.status(204).send();
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
