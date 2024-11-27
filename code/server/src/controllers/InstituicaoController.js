import InstituicaoService from '../services/InstituicaoService.js';

export class InstituicaoController {
  async create(req, res) {
    try {
      const data = req.body;
      const instituicao = await InstituicaoService.createInstituicao(data);
      return res.status(201).json(instituicao);
    } catch (error) {
      console.error('Erro ao criar instituição:', error);
      return res.status(500).json({ message: `Não foi possível criar a instituição. Detalhes: ${error.message}` });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const instituicao = await InstituicaoService.getInstituicaoById(id);
      return res.status(200).json(instituicao);
    } catch (error) {
      console.error('Erro ao buscar instituição por ID:', error);
      return res.status(500).json({ message: `Não foi possível buscar a instituição. Detalhes: ${error.message}` });
    }
  }

  async getAllInstituicoes(req, res) {
    try {
      const instituicoes = await InstituicaoService.getAllInstituicoes();
      return res.status(200).json(instituicoes);
    } catch (error) {
      console.error('Erro ao buscar instituições:', error);
      return res.status(500).json({ message: `Não foi possível buscar as instituições. Detalhes: ${error.message}` });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;
      const instituicao = await InstituicaoService.updateInstituicao(id, data);
      return res.status(200).json(instituicao);
    } catch (error) {
      console.error('Erro ao atualizar instituição:', error);
      return res.status(500).json({ message: `Não foi possível atualizar a instituição. Detalhes: ${error.message}` });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      await InstituicaoService.deleteInstituicao(id);
      return res.status(204).send();
    } catch (error) {
      console.error('Erro ao deletar instituição:', error);
      return res.status(500).json({ message: `Não foi possível deletar a instituição. Detalhes: ${error.message}` });
    }
  }

  async cadastrarProfessor(req, res) {
    try {
      const professorData = req.body;
      const professor = await InstituicaoService.cadastrarProfessor(professorData);
      return res.status(201).json(professor);
    } catch (error) {
      console.error('Erro ao cadastrar professor:', error);
      return res.status(500).json({ message: `Não foi possível cadastrar o professor. Detalhes: ${error.message}` });
    }
  }
}

export default new InstituicaoController();
