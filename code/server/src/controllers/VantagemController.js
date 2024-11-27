import VantagemService from '../services/VantagemService.js';

export class VantagemController {

  async getAll(req, res) {
    try {
      const vantagens = await VantagemService.getAllVantagens();
      return res.status(200).json(vantagens);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar vantagens.', error: error.message });
    }
  }
  async create(req, res) {
    try {
      const data = req.body;
      const vantagem = await VantagemService.createVantagem(data);
      return res.status(201).json(vantagem);
    } catch (error) {
      res.status(400).json({ message: 'Não foi possível cadastrar a vantagem.', error: error.message });
    }

  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const vantagem = await VantagemService.getVantagemById(parseInt(id));
      return res.status(200).json(vantagem);
    } catch (error) {
      res.status(404).json({ message: 'Vantagem não encontrada.', error: error.message });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;
      const vantagem = await VantagemService.updateVantagem(parseInt(id), data);
      return res.status(200).json(vantagem);
    } catch (error) {
      res.status(400).json({ message: 'Não foi possível atualizar a vantagem.', error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      await VantagemService.deleteVantagem(parseInt(id));
      return res.status(204).send();
    } catch (error) {
      res.status(404).json({ message: 'Vantagem não encontrada.', error: error.message });
    }
  }
}

export default new VantagemController();
