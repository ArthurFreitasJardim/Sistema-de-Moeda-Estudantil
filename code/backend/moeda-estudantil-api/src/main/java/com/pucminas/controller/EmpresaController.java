package com.pucminas.controller;

import com.pucminas.model.Empresa;
import com.pucminas.repository.EmpresaRepository;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.annotation.*;

import java.util.Optional;

@Controller("/empresas")
public class EmpresaController {

    private final EmpresaRepository repository;

    public EmpresaController(EmpresaRepository repository) {
        this.repository = repository;
    }

    @Get
    public Iterable<Empresa> listar() {
        return repository.findAll();
    }

    @Post
    public HttpResponse<Empresa> criar(@Body Empresa empresa) {
        return HttpResponse.created(repository.save(empresa));
    }

    @Delete("/{id}")
    public HttpResponse<?> deletar(@PathVariable Long id) {
        Optional<Empresa> empresa = repository.findById(id);
        if (empresa.isPresent()) {
            repository.delete(empresa.get());
            return HttpResponse.ok();
        }
        return HttpResponse.notFound();
    }
}