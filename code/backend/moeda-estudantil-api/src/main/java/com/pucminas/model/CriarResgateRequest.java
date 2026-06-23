package com.pucminas.model;

import io.micronaut.serde.annotation.Serdeable;

@Serdeable
public record CriarResgateRequest(
        Long alunoId,
        Long vantagemId
) {
}