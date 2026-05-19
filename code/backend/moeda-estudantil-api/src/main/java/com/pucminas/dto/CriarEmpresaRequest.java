package com.pucminas.dto;

import io.micronaut.serde.annotation.Serdeable;

@Serdeable
public record CriarEmpresaRequest(
        String nome,
        String email,
        String senha,
        String cnpj
) {}