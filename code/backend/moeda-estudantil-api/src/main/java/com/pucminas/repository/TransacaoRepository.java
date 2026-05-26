package com.pucminas.repository;

import com.pucminas.model.Transacao;
import io.micronaut.data.annotation.Repository;
import io.micronaut.data.repository.CrudRepository;

import java.util.List;

@Repository
public interface TransacaoRepository extends CrudRepository<Transacao, Long> {

    List<Transacao> findByRemetenteId(Long professorId);

    List<Transacao> findByDestinatarioId(Long alunoId);
}