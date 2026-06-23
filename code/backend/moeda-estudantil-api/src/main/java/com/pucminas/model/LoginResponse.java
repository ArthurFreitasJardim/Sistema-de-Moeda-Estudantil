package com.pucminas.model;

import io.micronaut.serde.annotation.Serdeable;

@Serdeable
public record LoginResponse(
        Long id,
        String nome,
        String email,
        String tipoUsuario,
        String rota
) {
}