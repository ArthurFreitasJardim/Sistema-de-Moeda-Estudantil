package com.pucminas.dto;

import io.micronaut.serde.annotation.Serdeable;

@Serdeable
public record ResgateVantagemResponse(
        Long id,
        Long alunoId,
        String alunoNome,
        Long vantagemId,
        String vantagemNome,
        String vantagemDescricao,
        Integer valorMoedas,
        Long empresaId,
        String empresaNome,
        String dataHora
) {}