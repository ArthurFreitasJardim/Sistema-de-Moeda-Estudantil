package com.pucminas.messaging;

import com.pucminas.model.Aluno;
import com.pucminas.model.Professor;
import com.pucminas.model.Transacao;
import com.pucminas.repository.AlunoRepository;
import com.pucminas.repository.ProfessorRepository;
import com.pucminas.repository.TransacaoRepository;
import com.pucminas.service.EmailService;
import io.micronaut.rabbitmq.annotation.Queue;
import io.micronaut.rabbitmq.annotation.RabbitListener;

@RabbitListener
public class EmailConsumer {

    private final EmailService emailService;
    private final TransacaoRepository transacaoRepository;
    private final ProfessorRepository professorRepository;
    private final AlunoRepository alunoRepository;

    public EmailConsumer(
            EmailService emailService,
            TransacaoRepository transacaoRepository,
            ProfessorRepository professorRepository,
            AlunoRepository alunoRepository) {
        this.emailService = emailService;
        this.transacaoRepository = transacaoRepository;
        this.professorRepository = professorRepository;
        this.alunoRepository = alunoRepository;
    }

    @Queue("moedas.email")
    public void processarEnvioMoedas(EnvioMoedasEvent evento) {
        try {
            System.out.println("Mensagem recebida do RabbitMQ: " + evento);

            Transacao transacao = null;
            Professor professor = null;
            Aluno aluno = null;

            for (int tentativa = 1; tentativa <= 5; tentativa++) {
                transacao = transacaoRepository.findById(evento.transacaoId()).orElse(null);
                professor = professorRepository.findById(evento.professorId()).orElse(null);
                aluno = alunoRepository.findById(evento.alunoId()).orElse(null);

                if (transacao != null && professor != null && aluno != null) {
                    break;
                }

                System.out.println("Tentativa " + tentativa + ": dados ainda nao encontrados. Aguardando...");
                Thread.sleep(1000);
            }

            if (transacao == null || professor == null || aluno == null) {
                System.out.println("Nao foi possivel enviar e-mails. Dados da transacao incompletos.");
                System.out.println("transacaoId=" + evento.transacaoId());
                System.out.println("professorId=" + evento.professorId());
                System.out.println("alunoId=" + evento.alunoId());
                return;
            }

            emailService.enviarConfirmacaoEnvioParaProfessor(professor, aluno, transacao);
            emailService.enviarConfirmacaoRecebimentoParaAluno(professor, aluno, transacao);

            System.out.println("E-mails processados via RabbitMQ para a transacao " + transacao.getId());

        } catch (Exception e) {
            System.out.println("Erro ao processar mensagem RabbitMQ: " + e.getMessage());
        }
    }
}