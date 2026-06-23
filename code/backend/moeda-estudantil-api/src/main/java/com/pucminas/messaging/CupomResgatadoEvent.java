package com.pucminas.messaging;

import io.micronaut.serde.annotation.Serdeable;

@Serdeable
public record CupomResgatadoEvent(
        Long resgateId
) {
}