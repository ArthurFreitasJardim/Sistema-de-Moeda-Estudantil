package com.pucminas.repository;

import com.pucminas.model.Vantagem;
import io.micronaut.data.annotation.Repository;
import io.micronaut.data.repository.CrudRepository;

@Repository
public interface VantagemRepository extends CrudRepository<Vantagem, Long> {
}