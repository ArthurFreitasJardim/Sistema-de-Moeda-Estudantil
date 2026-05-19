package com.pucminas.dto;

import io.micronaut.serde.annotation.Serdeable;

@Serdeable
public record EmpresaResponse(
        Long id,
        String nome,
        String email,
        String cnpj
) {}