import TransacaoService from '../services/TransacaoService.js';

export class TransacaoController {

  async recargaProfessor(req, res) {
    try {
      const { id } = req.params;
      const { numMoedas } = req.body;
      const transacao = await TransacaoService.transacaoRecarga(parseInt(id), parseInt(numMoedas));
      return res.status(200).json(transacao);
    } catch (error) {
      res.status(400).json({
        message: 'Não foi possível do professor receber as moedas.',
      });
    }
  }

}

export default new TransacaoController();
