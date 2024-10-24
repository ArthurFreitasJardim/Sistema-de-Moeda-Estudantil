import ProfessorService from '../services/ProfessorService.js';

export class ProfessorController {
  async create(req, res) {
    const data = req.body;
    const professor = await ProfessorService.createProfessor(data);
    return res.status(201).json(professor);
  }

  async getById(req, res) {
    const { id } = req.params;
    const professor = await ProfessorService.getProfessorById(id);
    return res.status(200).json(professor);
  }

  async update(req, res) {
    const { id } = req.params;
    const data = req.body;
    const professor = await ProfessorService.updateProfessor(id, data);
    return res.status(200).json(professor);
  }

  async delete(req, res) {
    const { id } = req.params;
    await ProfessorService.deleteProfessor(id);
    return res.status(204).send();
  }

  async consultarExtrato(req, res) {
    const { id } = req.params;
    const extrato = await ProfessorService.consultarExtrato(id);
    return res.status(200).json(extrato);
  }

  async enviarMoedas(req, res) {
    const { id } = req.params;  // ID do professor
    const { alunoId, valor } = req.body;  // Recebe o ID do aluno e o valor a enviar
    const resultado = await ProfessorService.enviarMoedas(alunoId, valor);
    return res.status(200).json(resultado);
  }
}

export default new ProfessorController();