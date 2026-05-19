package com.pucminas.dto;

import io.micronaut.serde.annotation.Serdeable;

@Serdeable
public record CriarAlunoRequest(
        String nome,
        String email,
        String senha,
        String cpf,
        String rg,
        String curso,
        String instituicaoNome
) {}