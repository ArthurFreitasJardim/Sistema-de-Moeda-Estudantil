package com.pucminas.model;

import io.micronaut.serde.annotation.Serdeable;

@Serdeable
public record LoginRequest(
        String email,
        String senha
) {
}