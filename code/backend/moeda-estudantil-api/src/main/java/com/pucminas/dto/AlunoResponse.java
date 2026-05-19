package com.pucminas.dto;

import io.micronaut.serde.annotation.Serdeable;

@Serdeable
public record AlunoResponse(
        Long id,
        String nome,
        String email,
        String cpf,
        String rg,
        String curso,
        String instituicaoNome,
        Integer saldoAtual
) {}