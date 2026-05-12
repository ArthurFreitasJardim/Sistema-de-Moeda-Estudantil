package com.pucminas.repository;

import com.pucminas.model.Empresa;
import io.micronaut.data.annotation.Repository;
import io.micronaut.data.repository.CrudRepository;

@Repository
public interface EmpresaRepository extends CrudRepository<Empresa, Long> {
}