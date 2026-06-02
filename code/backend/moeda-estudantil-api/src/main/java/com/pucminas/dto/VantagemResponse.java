package com.pucminas.dto;

import io.micronaut.serde.annotation.Serdeable;

@Serdeable
public record VantagemResponse(
        Long id,
        String nome,
        String descricao,
        Integer valorMoedas,
        Integer quantidadeDisponivel,
        Long empresaId,
        String empresaNome
) {}