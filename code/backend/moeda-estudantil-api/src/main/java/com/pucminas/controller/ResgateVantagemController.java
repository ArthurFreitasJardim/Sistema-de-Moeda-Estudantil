package com.pucminas.controller;

import com.pucminas.dto.CriarResgateRequest;
import com.pucminas.dto.ErroResponse;
import com.pucminas.dto.ResgateVantagemResponse;
import com.pucminas.model.Aluno;
import com.pucminas.model.ResgateVantagem;
import com.pucminas.model.Vantagem;
import com.pucminas.repository.AlunoRepository;
import com.pucminas.repository.ResgateVantagemRepository;
import com.pucminas.repository.VantagemRepository;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.MediaType;
import io.micronaut.http.annotation.*;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.StreamSupport;

@Controller("/resgates")
public class ResgateVantagemController {

    private final ResgateVantagemRepository resgateRepository;
    private final AlunoRepository alunoRepository;
    private final VantagemRepository vantagemRepository;

    public ResgateVantagemController(
            ResgateVantagemRepository resgateRepository,
            AlunoRepository alunoRepository,
            VantagemRepository vantagemRepository
    ) {
        this.resgateRepository = resgateRepository;
        this.alunoRepository = alunoRepository;
        this.vantagemRepository = vantagemRepository;
    }

    @Get(produces = MediaType.APPLICATION_JSON)
    public List<ResgateVantagemResponse> listarTodos() {
        return StreamSupport.stream(resgateRepository.findAll().spliterator(), false)
                .map(this::toResponse)
                .toList();
    }

    @Get(uri = "/aluno/{alunoId}", produces = MediaType.APPLICATION_JSON)
    public HttpResponse<?> listarPorAluno(@PathVariable Long alunoId) {
        Optional<Aluno> aluno = alunoRepository.findById(alunoId);

        if (aluno.isEmpty()) {
            return HttpResponse.notFound(new ErroResponse("Aluno não encontrado"));
        }

        List<ResgateVantagemResponse> resgates = resgateRepository.findByAlunoId(alunoId)
                .stream()
                .map(this::toResponse)
                .toList();

        return HttpResponse.ok(resgates);
    }

    @Post(consumes = MediaType.APPLICATION_JSON, produces = MediaType.APPLICATION_JSON)
    @Transactional
    public HttpResponse<?> resgatar(@Body CriarResgateRequest request) {
        try {
            if (request.alunoId() == null || request.vantagemId() == null) {
                return HttpResponse.badRequest(new ErroResponse("Aluno e vantagem são obrigatórios"));
            }

            Aluno aluno = alunoRepository.findById(request.alunoId()).orElse(null);
            Vantagem vantagem = vantagemRepository.findById(request.vantagemId()).orElse(null);

            if (aluno == null) {
                return HttpResponse.badRequest(new ErroResponse("Aluno não encontrado"));
            }

            if (vantagem == null) {
                return HttpResponse.badRequest(new ErroResponse("Vantagem não encontrada"));
            }

            boolean jaResgatou = resgateRepository.existsByAlunoIdAndVantagemId(
                    aluno.getId(),
                    vantagem.getId()
            );

            if (jaResgatou) {
                return HttpResponse.badRequest(new ErroResponse("Este aluno já resgatou esta vantagem"));
            }

            if (aluno.getSaldoAtual() == null) {
                aluno.setSaldoAtual(0);
            }

            if (vantagem.getValorMoedas() == null || vantagem.getValorMoedas() <= 0) {
                return HttpResponse.badRequest(new ErroResponse("Valor da vantagem inválido"));
            }

            if (vantagem.getQuantidadeDisponivel() == null || vantagem.getQuantidadeDisponivel() <= 0) {
                return HttpResponse.badRequest(new ErroResponse("Esta vantagem não possui unidades disponíveis"));
            }

            if (aluno.getSaldoAtual() < vantagem.getValorMoedas()) {
                return HttpResponse.badRequest(new ErroResponse("Saldo insuficiente para resgatar esta vantagem"));
            }

            aluno.setSaldoAtual(aluno.getSaldoAtual() - vantagem.getValorMoedas());
            vantagem.setQuantidadeDisponivel(vantagem.getQuantidadeDisponivel() - 1);

            alunoRepository.update(aluno);
            vantagemRepository.update(vantagem);

            ResgateVantagem resgate = new ResgateVantagem();
            resgate.setAluno(aluno);
            resgate.setVantagem(vantagem);
            resgate.setValorMoedas(vantagem.getValorMoedas());

            ResgateVantagem resgateSalvo = resgateRepository.save(resgate);

            return HttpResponse.created(toResponse(resgateSalvo));

        } catch (Exception e) {
            return HttpResponse.serverError(new ErroResponse(e.getMessage()));
        }
    }

    private ResgateVantagemResponse toResponse(ResgateVantagem resgate) {
        Aluno aluno = resgate.getAluno();
        Vantagem vantagem = resgate.getVantagem();

        Long empresaId = null;
        String empresaNome = "";

        if (vantagem != null && vantagem.getEmpresa() != null) {
            empresaId = vantagem.getEmpresa().getId();
            empresaNome = vantagem.getEmpresa().getNome();
        }

        return new ResgateVantagemResponse(
                resgate.getId(),
                aluno != null ? aluno.getId() : null,
                aluno != null ? aluno.getNome() : "",
                vantagem != null ? vantagem.getId() : null,
                vantagem != null ? vantagem.getNome() : "",
                vantagem != null ? vantagem.getDescricao() : "",
                resgate.getValorMoedas(),
                empresaId,
                empresaNome,
                resgate.getDataHora() != null ? resgate.getDataHora().toString() : ""
        );
    }
}