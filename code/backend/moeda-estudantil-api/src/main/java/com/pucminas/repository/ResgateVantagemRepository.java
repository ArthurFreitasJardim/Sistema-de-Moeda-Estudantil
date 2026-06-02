package com.pucminas.repository;

import com.pucminas.model.ResgateVantagem;
import io.micronaut.data.annotation.Repository;
import io.micronaut.data.repository.CrudRepository;

import java.util.List;

@Repository
public interface ResgateVantagemRepository extends CrudRepository<ResgateVantagem, Long> {

    List<ResgateVantagem> findByAlunoId(Long alunoId);

    boolean existsByAlunoIdAndVantagemId(Long alunoId, Long vantagemId);
}