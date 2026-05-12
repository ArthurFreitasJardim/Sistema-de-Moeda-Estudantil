package com.pucminas.repository;

import com.pucminas.model.Aluno;
import io.micronaut.data.annotation.Repository;
import io.micronaut.data.repository.CrudRepository;

@Repository
public interface AlunoRepository extends CrudRepository<Aluno, Long> {
}