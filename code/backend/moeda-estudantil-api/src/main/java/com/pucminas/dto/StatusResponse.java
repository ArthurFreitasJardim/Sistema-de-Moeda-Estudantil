package com.pucminas.dto;

import io.micronaut.serde.annotation.Serdeable;

@Serdeable
public record StatusResponse(
        String status
) {}