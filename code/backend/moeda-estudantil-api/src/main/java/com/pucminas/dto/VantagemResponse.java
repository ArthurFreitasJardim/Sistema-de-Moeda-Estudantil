package com.pucminas.dto;

import io.micronaut.serde.annotation.Serdeable;

@Serdeable
public record VantagemResponse(
        Long id,
        String nome,
        String descricao,
        Integer valorMoedas,
        Long empresaId,
        String empresaNome
) {}