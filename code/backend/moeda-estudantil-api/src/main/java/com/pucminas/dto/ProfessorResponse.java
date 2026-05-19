package com.pucminas.dto;

import io.micronaut.serde.annotation.Serdeable;

@Serdeable
public record ProfessorResponse(
        Long id,
        String nome,
        String departamento,
        String instituicaoNome,
        Integer saldoCorrente
) {}