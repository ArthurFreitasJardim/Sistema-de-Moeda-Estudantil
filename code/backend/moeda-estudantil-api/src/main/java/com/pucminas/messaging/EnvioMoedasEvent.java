package com.pucminas.messaging;

import io.micronaut.serde.annotation.Serdeable;

@Serdeable
public record EnvioMoedasEvent(
        Long transacaoId,
        Long professorId,
        Long alunoId
) {}