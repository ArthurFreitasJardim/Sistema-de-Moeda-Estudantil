import TransacaoService from '../services/TransacaoService.js';
import AlunoService from '../services/AlunoService.js';
import EmpresaService from '../services/EmpresaService.js';
import ProfessorService from '../services/ProfessorService.js';

export class TransacaoController {

  async recarga(req, res) {
    try {
      const transacao = await TransacaoService.recarga(req.body);
      return res.status(200).json(transacao);
    } catch (error) {
      res.status(400).json({
        message: 'Não foi possível do professor receber as moedas.',
      });
    }
  }

  async envio(req, res) {
    try {
      
      const data = req.body;
      console.log(data.numMoedas)
      const transacao = await TransacaoService.enviar(data);
      return res.status(200).json(transacao);
    } catch (error) {
      res.status(400).json({
        message: 'Não foi possível realizar o envio das moedas.',
      });
    }
  }

  async troca(req, res) {
    try {
      const data = req.body;
      console.log(data.numMoedas);
      const transacao = await TransacaoService.trocar(data);
      return res.status(200).json(transacao);
    } catch (error) {
      res.status(400).json({
        message: 'Não foi possível realizar a troca de moedas.',
      });
    }
  }

  // async enviarMoedas(req, res) {
  //   const data = req.body;

  //   const professor = await ProfessorService.getProfessorById(data.professorId);
  //   const aluno = await AlunoService.getAlunoById(data.alunoId);

  //   if (!professor || !aluno) {
  //     return res.status(404).json({ message: 'Professor ou aluno não encontrado.' });
  //   }

  //   try {
  //     const resultado = await TransacaoService.enviarMoedas(data);
  //     return res.status(200).json(resultado);
  //   } catch (error) {
  //     res.status(400).json({ message: 'Não foi possível realizar a transação.' });
  //   }
  // }

}

export default new TransacaoController();
