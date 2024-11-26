import InstituicaoService from '../services/InstituicaoService.js';

export class InstituicaoController {

  async getAll(req, res) {
    try {
        const instituicoes = await InstituicaoService.getAllInstituicoes();
        return res.status(200).json(instituicoes);
    } catch (error) {
      console.error(error);
      return res.status(500).send('Error interno');
    }
  }

  async create(req, res) {
    const data = req.body;
    const instituicao = await InstituicaoService.createInstituicao(data);
    return res.status(201).json(instituicao);
  }

  async getById(req, res) {
    const { id } = req.params;
    const instituicao = await InstituicaoService.getInstituicaoById(parseInt(id));
    return res.status(200).json(instituicao);
  }

  async update(req, res) {
    const { id } = req.params;
    const data = req.body;
    const instituicao = await InstituicaoService.updateInstituicao(id, data);
    return res.status(200).json(instituicao);
  }

  async delete(req, res) {
    const { id } = req.params;
    await InstituicaoService.deleteInstituicao(id);
    return res.status(204).send();
  }

  async cadastrarProfessor(req, res) {
    const professorData = req.body;  // Dados do professor
    const professor = await InstituicaoService.cadastrarProfessor(professorData);
    return res.status(201).json(professor);
  }
}

export default new InstituicaoController();
