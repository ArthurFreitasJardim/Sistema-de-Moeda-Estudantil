import TransacaoService from '../services/TransacaoService.js';

export class TransacaoController {
  async create(req, res) {
    const data = req.body;
    const transacao = await TransacaoService.createTransacao(data);
    return res.status(201).json(transacao);
  }

  async getById(req, res) {
    const { id } = req.params;
    const transacao = await TransacaoService.getTransacaoById(id);
    return res.status(200).json(transacao);
  }

  async update(req, res) {
    const { id } = req.params;
    const data = req.body;
    const transacao = await TransacaoService.updateTransacao(id, data);
    return res.status(200).json(transacao);
  }

  async delete(req, res) {
    const { id } = req.params;
    await TransacaoService.deleteTransacao(id);
    return res.status(204).send();
  }

}

export default new TransacaoController();
