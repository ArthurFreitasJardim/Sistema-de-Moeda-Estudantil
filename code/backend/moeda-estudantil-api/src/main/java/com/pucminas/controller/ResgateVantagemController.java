package com.pucminas.controller;

import com.pucminas.messaging.CupomResgatadoEvent;
import com.pucminas.messaging.EmailProducer;
import com.pucminas.model.Aluno;
import com.pucminas.model.CriarResgateRequest;
import com.pucminas.model.CupomService;
import com.pucminas.model.Empresa;
import com.pucminas.model.ResgateVantagem;
import com.pucminas.model.ResgateVantagemResponse;
import com.pucminas.model.Vantagem;
import com.pucminas.repository.AlunoRepository;
import com.pucminas.repository.ResgateVantagemRepository;
import com.pucminas.repository.VantagemRepository;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.annotation.Body;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Get;
import io.micronaut.http.annotation.Post;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Controller("/resgates")
public class ResgateVantagemController {

    private final ResgateVantagemRepository resgateRepository;
    private final AlunoRepository alunoRepository;
    private final VantagemRepository vantagemRepository;
    private final CupomService cupomService;
    private final EmailProducer emailProducer;

    public ResgateVantagemController(
            ResgateVantagemRepository resgateRepository,
            AlunoRepository alunoRepository,
            VantagemRepository vantagemRepository,
            CupomService cupomService,
            EmailProducer emailProducer
    ) {
        this.resgateRepository = resgateRepository;
        this.alunoRepository = alunoRepository;
        this.vantagemRepository = vantagemRepository;
        this.cupomService = cupomService;
        this.emailProducer = emailProducer;
    }

    @Get
    public List<ResgateVantagemResponse> listarTodos() {
        return resgateRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Get("/aluno/{alunoId}")
    public List<ResgateVantagemResponse> listarPorAluno(Long alunoId) {
        return resgateRepository.findByAlunoId(alunoId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Post
    @Transactional
    public HttpResponse<?> resgatar(@Body CriarResgateRequest request) {
        if (request.alunoId() == null || request.vantagemId() == null) {
            return HttpResponse.badRequest(Map.of("message", "Aluno e vantagem sao obrigatorios."));
        }

        Optional<Aluno> alunoOpt = alunoRepository.findById(request.alunoId());
        if (alunoOpt.isEmpty()) {
            return HttpResponse.badRequest(Map.of("message", "Aluno nao encontrado."));
        }

        Optional<Vantagem> vantagemOpt = vantagemRepository.findById(request.vantagemId());
        if (vantagemOpt.isEmpty()) {
            return HttpResponse.badRequest(Map.of("message", "Vantagem nao encontrada."));
        }

        Aluno aluno = alunoOpt.get();
        Vantagem vantagem = vantagemOpt.get();

        boolean jaResgatou = resgateRepository.existsByAlunoIdAndVantagemId(aluno.getId(), vantagem.getId());
        if (jaResgatou) {
            return HttpResponse.badRequest(Map.of("message", "Este aluno ja resgatou essa vantagem."));
        }

        if (vantagem.getQuantidadeDisponivel() == null || vantagem.getQuantidadeDisponivel() <= 0) {
            return HttpResponse.badRequest(Map.of("message", "Esta vantagem nao possui unidades disponiveis."));
        }

        if (aluno.getSaldoAtual() == null || aluno.getSaldoAtual() < vantagem.getValorMoedas()) {
            return HttpResponse.badRequest(Map.of("message", "Saldo insuficiente para resgatar esta vantagem."));
        }

        aluno.setSaldoAtual(aluno.getSaldoAtual() - vantagem.getValorMoedas());
        vantagem.setQuantidadeDisponivel(vantagem.getQuantidadeDisponivel() - 1);

        alunoRepository.update(aluno);
        vantagemRepository.update(vantagem);

        String codigoCupom = cupomService.gerarCodigoCupom(aluno, vantagem);

        ResgateVantagem resgate = new ResgateVantagem(
                aluno,
                vantagem,
                vantagem.getValorMoedas(),
                codigoCupom
        );

        ResgateVantagem salvo = resgateRepository.save(resgate);

        try {
            emailProducer.publicarCupomResgatado(new CupomResgatadoEvent(salvo.getId()));
        } catch (Exception e) {
            System.out.println("Nao foi possivel publicar evento de cupom no RabbitMQ: " + e.getMessage());
        }

        return HttpResponse.created(toResponse(salvo));
    }

    private ResgateVantagemResponse toResponse(ResgateVantagem resgate) {
        Vantagem vantagem = resgate.getVantagem();
        Aluno aluno = resgate.getAluno();
        Empresa empresa = vantagem.getEmpresa();

        return new ResgateVantagemResponse(
                resgate.getId(),
                aluno.getId(),
                aluno.getNome(),
                vantagem.getId(),
                vantagem.getNome(),
                vantagem.getDescricao(),
                resgate.getValorMoedas(),
                empresa.getId(),
                empresa.getNome(),
                resgate.getCodigoCupom(),
                resgate.getDataHora().toString()
        );
    }
}