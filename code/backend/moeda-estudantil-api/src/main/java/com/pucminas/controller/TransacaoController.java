package com.pucminas.controller;

import com.pucminas.dto.CriarTransacaoRequest;
import com.pucminas.dto.ErroResponse;
import com.pucminas.dto.StatusResponse;
import com.pucminas.dto.TransacaoExtratoResponse;
import com.pucminas.dto.TransacaoProfessorResponse;
import com.pucminas.messaging.EmailProducer;
import com.pucminas.messaging.EnvioMoedasEvent;
import com.pucminas.model.Aluno;
import com.pucminas.model.Professor;
import com.pucminas.model.Transacao;
import com.pucminas.repository.AlunoRepository;
import com.pucminas.repository.ProfessorRepository;
import com.pucminas.repository.TransacaoRepository;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.MediaType;
import io.micronaut.http.annotation.*;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.stream.StreamSupport;

@Controller("/transacoes")
public class TransacaoController {

    private final TransacaoRepository transacaoRepository;
    private final ProfessorRepository professorRepository;
    private final AlunoRepository alunoRepository;
    private final EmailProducer emailProducer;

    public TransacaoController(
            TransacaoRepository transacaoRepository,
            ProfessorRepository professorRepository,
            AlunoRepository alunoRepository,
            EmailProducer emailProducer) {
        this.transacaoRepository = transacaoRepository;
        this.professorRepository = professorRepository;
        this.alunoRepository = alunoRepository;
        this.emailProducer = emailProducer;
    }

    @Get(uri = "/professor/{professorId}", produces = MediaType.APPLICATION_JSON)
    public List<TransacaoProfessorResponse> listarPorProfessor(@PathVariable Long professorId) {
        return StreamSupport.stream(
                transacaoRepository.findByRemetenteId(professorId).spliterator(),
                false)
                .map(this::toProfessorResponse)
                .toList();
    }

    @Get(uri = "/aluno/{alunoId}", produces = MediaType.APPLICATION_JSON)
    public List<TransacaoExtratoResponse> listarPorAluno(@PathVariable Long alunoId) {
        return StreamSupport.stream(
                transacaoRepository.findByDestinatarioId(alunoId).spliterator(),
                false)
                .map(this::toExtratoResponse)
                .toList();
    }

    @Post(consumes = MediaType.APPLICATION_JSON, produces = MediaType.APPLICATION_JSON)
    @Transactional
    public HttpResponse<?> criar(@Body CriarTransacaoRequest request) {
        try {
            if (request.remetenteId() == null ||
                    request.destinatarioId() == null ||
                    request.valor() == null ||
                    request.valor() <= 0 ||
                    request.motivo() == null ||
                    request.motivo().isBlank()) {
                return HttpResponse.badRequest(new ErroResponse("Dados inválidos"));
            }

            Professor professor = professorRepository.findById(request.remetenteId()).orElse(null);
            Aluno aluno = alunoRepository.findById(request.destinatarioId()).orElse(null);

            if (professor == null || aluno == null) {
                return HttpResponse.badRequest(new ErroResponse("Professor ou aluno não encontrados"));
            }

            if (!pertenceAoMesmoCursoEInstituicao(professor, aluno)) {
                return HttpResponse
                        .badRequest(new ErroResponse("Aluno não pertence ao mesmo curso e instituição do professor"));
            }

            if (professor.getSaldoCorrente() < request.valor()) {
                return HttpResponse.badRequest(new ErroResponse("Saldo insuficiente"));
            }

            professor.setSaldoCorrente(professor.getSaldoCorrente() - request.valor());
            aluno.setSaldoAtual(aluno.getSaldoAtual() + request.valor());

            professorRepository.update(professor);
            alunoRepository.update(aluno);

            Transacao transacao = new Transacao();
            transacao.setRemetente(professor);
            transacao.setDestinatario(aluno);
            transacao.setValor(request.valor());
            transacao.setMotivo(request.motivo().trim());

            Transacao transacaoSalva = transacaoRepository.save(transacao);

            try {
                emailProducer.publicarEnvioMoedas(
                        new EnvioMoedasEvent(
                                transacaoSalva.getId(),
                                professor.getId(),
                                aluno.getId()));

                System.out.println("Mensagem publicada no RabbitMQ para envio de e-mails.");

            } catch (Exception rabbitException) {
                System.out.println("Erro ao publicar mensagem no RabbitMQ: " + rabbitException.getMessage());
            }
            ;

            return HttpResponse.created(new StatusResponse("sucesso"));

        } catch (Exception e) {
            return HttpResponse.serverError(new ErroResponse(e.getMessage()));
        }
    }

    private boolean pertenceAoMesmoCursoEInstituicao(Professor professor, Aluno aluno) {
        if (professor.getDepartamento() == null ||
                professor.getInstituicao() == null ||
                professor.getInstituicao().getNome() == null ||
                aluno.getCurso() == null ||
                aluno.getInstituicao() == null ||
                aluno.getInstituicao().getNome() == null) {
            return false;
        }

        return aluno.getCurso().equals(professor.getDepartamento())
                && aluno.getInstituicao().getNome().equals(professor.getInstituicao().getNome());
    }

    private TransacaoProfessorResponse toProfessorResponse(Transacao transacao) {
        String destinatarioNome = transacao.getDestinatario() != null
                ? transacao.getDestinatario().getNome()
                : "Aluno Excluído";

        return new TransacaoProfessorResponse(
                transacao.getId(),
                destinatarioNome,
                transacao.getValor(),
                transacao.getMotivo(),
                transacao.getDataHora() != null ? transacao.getDataHora().toString() : "");
    }

    private TransacaoExtratoResponse toExtratoResponse(Transacao transacao) {
        Long professorId = transacao.getRemetente() != null
                ? transacao.getRemetente().getId()
                : null;

        String professorNome = transacao.getRemetente() != null
                ? transacao.getRemetente().getNome()
                : "Professor não encontrado";

        Long alunoId = transacao.getDestinatario() != null
                ? transacao.getDestinatario().getId()
                : null;

        String alunoNome = transacao.getDestinatario() != null
                ? transacao.getDestinatario().getNome()
                : "Aluno não encontrado";

        return new TransacaoExtratoResponse(
                transacao.getId(),
                professorId,
                professorNome,
                alunoId,
                alunoNome,
                transacao.getValor(),
                transacao.getMotivo(),
                transacao.getDataHora() != null ? transacao.getDataHora().toString() : "");
    }
}