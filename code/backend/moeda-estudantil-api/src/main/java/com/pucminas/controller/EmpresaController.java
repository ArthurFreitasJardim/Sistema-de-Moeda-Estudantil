package com.pucminas.controller;

import com.pucminas.dto.CriarEmpresaRequest;
import com.pucminas.dto.EmpresaResponse;
import com.pucminas.dto.ErroResponse;
import com.pucminas.model.Empresa;
import com.pucminas.repository.EmpresaRepository;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.MediaType;
import io.micronaut.http.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.StreamSupport;

@Controller("/empresas")
public class EmpresaController {

    private final EmpresaRepository repository;

    public EmpresaController(EmpresaRepository repository) {
        this.repository = repository;
    }

    @Get(produces = MediaType.APPLICATION_JSON)
    public List<EmpresaResponse> listar() {
        return StreamSupport.stream(repository.findAll().spliterator(), false)
                .map(this::toResponse)
                .toList();
    }

    @Get(uri = "/{id}", produces = MediaType.APPLICATION_JSON)
    public HttpResponse<?> buscarPorId(@PathVariable Long id) {
        Optional<Empresa> empresa = repository.findById(id);

        if (empresa.isEmpty()) {
            return HttpResponse.notFound(new ErroResponse("Empresa não encontrada"));
        }

        return HttpResponse.ok(toResponse(empresa.get()));
    }

    @Post(consumes = MediaType.APPLICATION_JSON, produces = MediaType.APPLICATION_JSON)
    public HttpResponse<?> criar(@Body CriarEmpresaRequest request) {
        try {
            if (
                    request.nome() == null || request.nome().isBlank() ||
                    request.email() == null || request.email().isBlank() ||
                    request.senha() == null || request.senha().isBlank() ||
                    request.cnpj() == null || request.cnpj().isBlank()
            ) {
                return HttpResponse.badRequest(new ErroResponse("Todos os campos da empresa são obrigatórios"));
            }

            Empresa empresa = new Empresa();
            empresa.setNome(request.nome().trim());
            empresa.setEmail(request.email().trim().toLowerCase());
            empresa.setSenha(request.senha());
            empresa.setCnpj(request.cnpj().trim());

            Empresa empresaSalva = repository.save(empresa);

            return HttpResponse.created(toResponse(empresaSalva));

        } catch (Exception e) {
            return HttpResponse.serverError(new ErroResponse(e.getMessage()));
        }
    }

    @Delete("/{id}")
    public HttpResponse<?> deletar(@PathVariable Long id) {
        Optional<Empresa> empresa = repository.findById(id);

        if (empresa.isPresent()) {
            repository.delete(empresa.get());
            return HttpResponse.ok();
        }

        return HttpResponse.notFound(new ErroResponse("Empresa não encontrada"));
    }

    private EmpresaResponse toResponse(Empresa empresa) {
        return new EmpresaResponse(
                empresa.getId(),
                empresa.getNome(),
                empresa.getEmail(),
                empresa.getCnpj()
        );
    }
}