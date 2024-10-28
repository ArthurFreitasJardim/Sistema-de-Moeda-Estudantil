import VantagemService from '../services/VantagemService.js';

export class VantagemController {
  async create(req, res) {
    const data = req.body;
    const vantagem = await VantagemService.createVantagem(data);
    return res.status(201).json(vantagem);
  }

  async getById(req, res) {
    const { id } = req.params;
    const vantagem = await VantagemService.getVantagemById(id);
    return res.status(200).json(vantagem);
  }

  async update(req, res) {
    const { id } = req.params;
    const data = req.body;
    const vantagem = await VantagemService.updateVantagem(id, data);
    return res.status(200).json(vantagem);
  }

  async delete(req, res) {
    const { id } = req.params;
    await VantagemService.deleteVantagem(id);
    return res.status(204).send();
  }
}

export default new VantagemController();
