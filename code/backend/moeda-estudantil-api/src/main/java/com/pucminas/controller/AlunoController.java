package com.pucminas.controller;

import com.pucminas.model.Aluno;
import com.pucminas.repository.AlunoRepository;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.annotation.*;

import java.util.Optional;

@Controller("/alunos")
public class AlunoController {

    private final AlunoRepository repository;

    public AlunoController(AlunoRepository repository) {
        this.repository = repository;
    }

    @Get
    public Iterable<Aluno> listar() {
        return repository.findAll();
    }

    @Post
    public HttpResponse<Aluno> criar(@Body Aluno aluno) {
        aluno.setSaldoAtual(0); 
        return HttpResponse.created(repository.save(aluno));
    }

    @Delete("/{id}")
    public HttpResponse<?> deletar(@PathVariable Long id) {
        Optional<Aluno> aluno = repository.findById(id);
        if (aluno.isPresent()) {
            repository.delete(aluno.get());
            return HttpResponse.ok();
        }
        return HttpResponse.notFound();
    }
}