package com.pucminas.dto;

import io.micronaut.serde.annotation.Serdeable;

@Serdeable
public record TransacaoExtratoResponse(
        Long id,
        Long professorId,
        String professorNome,
        Long alunoId,
        String alunoNome,
        Integer valor,
        String motivo,
        String dataHora
) {}