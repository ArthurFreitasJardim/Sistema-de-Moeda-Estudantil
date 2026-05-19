package com.pucminas.repository;


import com.pucminas.model.Professor;
import io.micronaut.data.annotation.Repository;
import io.micronaut.data.repository.CrudRepository;

@Repository
public interface ProfessorRepository extends CrudRepository<Professor, Long> {
    // O Micronaut Data implementará automaticamente os métodos save, findById, update, etc.
}