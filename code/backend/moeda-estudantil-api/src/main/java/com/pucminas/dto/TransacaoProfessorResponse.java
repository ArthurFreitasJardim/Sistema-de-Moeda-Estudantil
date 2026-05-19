package com.pucminas.dto;

import io.micronaut.serde.annotation.Serdeable;

@Serdeable
public record TransacaoProfessorResponse(
        Long id,
        String destinatarioNome,
        Integer valor,
        String motivo,
        String dataHora
) {}