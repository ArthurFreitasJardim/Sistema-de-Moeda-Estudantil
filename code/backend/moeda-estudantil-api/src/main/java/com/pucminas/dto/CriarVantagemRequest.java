package com.pucminas.dto;

import io.micronaut.serde.annotation.Serdeable;

@Serdeable
public record CriarVantagemRequest(
        Long empresaId,
        String nome,
        String descricao,
        Integer valorMoedas
) {}