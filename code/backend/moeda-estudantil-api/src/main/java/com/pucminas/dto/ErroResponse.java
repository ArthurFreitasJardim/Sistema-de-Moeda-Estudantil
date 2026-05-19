package com.pucminas.dto;

import io.micronaut.serde.annotation.Serdeable;

@Serdeable
public record ErroResponse(
        String erro
) {}