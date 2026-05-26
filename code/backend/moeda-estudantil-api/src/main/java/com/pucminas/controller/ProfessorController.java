package com.pucminas.controller;

import com.pucminas.dto.ErroResponse;
import com.pucminas.dto.ProfessorResponse;
import com.pucminas.model.Professor;
import com.pucminas.repository.ProfessorRepository;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.MediaType;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Get;
import io.micronaut.http.annotation.PathVariable;

import java.util.List;
import java.util.Optional;
import java.util.stream.StreamSupport;

@Controller("/professores")
public class ProfessorController {

    private final ProfessorRepository repository;

    public ProfessorController(ProfessorRepository repository) {
        this.repository = repository;
    }

    @Get(produces = MediaType.APPLICATION_JSON)
    public List<ProfessorResponse> listarTodos() {
        return StreamSupport.stream(repository.findAll().spliterator(), false)
                .map(this::toResponse)
                .toList();
    }

    @Get(uri = "/{id}", produces = MediaType.APPLICATION_JSON)
    public HttpResponse<?> buscarPorId(@PathVariable Long id) {
        Optional<Professor> professor = repository.findById(id);

        if (professor.isEmpty()) {
            return HttpResponse.notFound(new ErroResponse("Professor não encontrado"));
        }

        return HttpResponse.ok(toResponse(professor.get()));
    }

    private ProfessorResponse toResponse(Professor professor) {
        String instituicaoNome = professor.getInstituicao() != null
                ? professor.getInstituicao().getNome()
                : "";

        return new ProfessorResponse(
                professor.getId(),
                professor.getNome(),
                professor.getDepartamento(),
                instituicaoNome,
                professor.getSaldoCorrente()
        );
    }
}