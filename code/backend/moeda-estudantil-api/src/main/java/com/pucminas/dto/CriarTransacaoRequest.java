package com.pucminas.dto;

import io.micronaut.serde.annotation.Serdeable;

@Serdeable
public record CriarTransacaoRequest(
        Long remetenteId,
        Long destinatarioId,
        Integer valor,
        String motivo
) {}