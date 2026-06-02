package com.pucminas.controller;

import com.pucminas.dto.CriarVantagemRequest;
import com.pucminas.dto.ErroResponse;
import com.pucminas.dto.VantagemResponse;
import com.pucminas.model.Empresa;
import com.pucminas.model.Vantagem;
import com.pucminas.repository.EmpresaRepository;
import com.pucminas.repository.VantagemRepository;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.MediaType;
import io.micronaut.http.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.StreamSupport;

@Controller("/vantagens")
public class VantagemController {

    private final VantagemRepository vantagemRepository;
    private final EmpresaRepository empresaRepository;

    public VantagemController(
            VantagemRepository vantagemRepository,
            EmpresaRepository empresaRepository
    ) {
        this.vantagemRepository = vantagemRepository;
        this.empresaRepository = empresaRepository;
    }

    @Get(produces = MediaType.APPLICATION_JSON)
    public List<VantagemResponse> listarTodas() {
        return StreamSupport.stream(vantagemRepository.findAll().spliterator(), false)
                .map(this::toResponse)
                .toList();
    }

    @Get(uri = "/empresa/{empresaId}", produces = MediaType.APPLICATION_JSON)
    public HttpResponse<?> listarPorEmpresa(@PathVariable Long empresaId) {
        Optional<Empresa> empresaOptional = empresaRepository.findById(empresaId);

        if (empresaOptional.isEmpty()) {
            return HttpResponse.notFound(new ErroResponse("Empresa não encontrada"));
        }

        List<VantagemResponse> vantagens = StreamSupport.stream(vantagemRepository.findAll().spliterator(), false)
                .filter(vantagem -> vantagem.getEmpresa() != null)
                .filter(vantagem -> vantagem.getEmpresa().getId().equals(empresaId))
                .map(this::toResponse)
                .toList();

        return HttpResponse.ok(vantagens);
    }

    @Post(consumes = MediaType.APPLICATION_JSON, produces = MediaType.APPLICATION_JSON)
    public HttpResponse<?> criar(@Body CriarVantagemRequest request) {
        try {
            if (
                    request.empresaId() == null ||
                    request.nome() == null || request.nome().isBlank() ||
                    request.descricao() == null || request.descricao().isBlank() ||
                    request.valorMoedas() == null || request.valorMoedas() <= 0 ||
                    request.quantidadeDisponivel() == null || request.quantidadeDisponivel() <= 0
            ) {
                return HttpResponse.badRequest(new ErroResponse("Todos os campos da vantagem são obrigatórios"));
            }

            Empresa empresa = empresaRepository.findById(request.empresaId()).orElse(null);

            if (empresa == null) {
                return HttpResponse.badRequest(new ErroResponse("Empresa não encontrada"));
            }

            Vantagem vantagem = new Vantagem();
            vantagem.setNome(request.nome().trim());
            vantagem.setDescricao(request.descricao().trim());
            vantagem.setValorMoedas(request.valorMoedas());
            vantagem.setQuantidadeDisponivel(request.quantidadeDisponivel());
            vantagem.setEmpresa(empresa);

            Vantagem vantagemSalva = vantagemRepository.save(vantagem);

            return HttpResponse.created(toResponse(vantagemSalva));

        } catch (Exception e) {
            return HttpResponse.serverError(new ErroResponse(e.getMessage()));
        }
    }

    @Delete("/{id}")
    public HttpResponse<?> deletar(@PathVariable Long id) {
        Optional<Vantagem> vantagem = vantagemRepository.findById(id);

        if (vantagem.isPresent()) {
            vantagemRepository.delete(vantagem.get());
            return HttpResponse.ok();
        }

        return HttpResponse.notFound(new ErroResponse("Vantagem não encontrada"));
    }

    private VantagemResponse toResponse(Vantagem vantagem) {
        Long empresaId = vantagem.getEmpresa() != null
                ? vantagem.getEmpresa().getId()
                : null;

        String empresaNome = vantagem.getEmpresa() != null
                ? vantagem.getEmpresa().getNome()
                : "";

        Integer quantidadeDisponivel = vantagem.getQuantidadeDisponivel() != null
                ? vantagem.getQuantidadeDisponivel()
                : 0;

        return new VantagemResponse(
                vantagem.getId(),
                vantagem.getNome(),
                vantagem.getDescricao(),
                vantagem.getValorMoedas(),
                quantidadeDisponivel,
                empresaId,
                empresaNome
        );
    }
}