package com.pucminas.model;

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
        String codigoCupom,
        String dataHora
) {
}