import ProfessorService from '../services/ProfessorService.js';

export class ProfessorController {

  async getAll(req, res) {
    try {
      const professores = await ProfessorService.getAllProfessores();
      return res.status(200).json(professores);
    } catch (error) {
      res.status(400).json({
        message: 'Não foi possível buscar os professores. Tente novamente mais tarde.',
      });
    }

  }

  async create(req, res) {
    try {
      const data = req.body;
      const professor = await ProfessorService.createProfessor(data);
      return res.status(201).json(professor);
    } catch (error) {
      res.status(400).json({
        message: 'Não foi possível cadastrar o professor. Tente novamente mais tarde.',
      });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const professor = await ProfessorService.getProfessorById(id);
      return res.status(200).json(professor);
    } catch (error) {
      res.status(400).json({
        message: `Não foi possível buscar o professor com o ID ${id}.`,
      });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;
      const professor = await ProfessorService.updateProfessor(id, data);
      return res.status(200).json(professor);
    } catch (error) {
      res.status(400).json({
        message: 'Não foi possível atualizar o professor.',
      });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      await ProfessorService.deleteProfessor(id);
      return res.status(204).send();
    } catch (error) {
      res.status(400).json({
        message: 'Não foi possível excluir o professor.',
      });
    }
  }

  async recarga(req, res) {
    try {
      const { id } = req.params;
      const { numMoedas } = req.body;
      const professor = await ProfessorService.recarga(parseInt(id), parseInt(numMoedas));
      return res.status(200).json(professor);
    } catch (error) {
      res.status(400).json({
        message: 'Não foi possível do professor receber as moedas.',
      });
    }
  }

  async debitar(req, res) {
    try {
      const { id } = req.params;
      const { numMoedas } = req.body;

      console.log(req.body);
      const resultado = await ProfessorService.debitar(parseInt(id), parseInt(numMoedas));
      return res.status(200).json(resultado);
    } catch (error) {
      res.status(400).json({
        message: 'Não foi possível debitar as moedas do professor.',
      });
    }
  }

  async consultarExtrato(req, res) {
    try {
      const { id } = req.params;
      const extrato = await ProfessorService.consultarExtrato(id);
      return res.status(200).json(extrato);
    } catch (error) {
      res.status(400).json({
        message: `Não foi possível consultar o extrato do professor com o ID ${id}.`,
      });
    }
  }

}

export default new ProfessorController();
