package com.pucminas.model;

import io.micronaut.serde.annotation.Serdeable;

@Serdeable
public class TransacaoPayload {
    private Long remetenteId;
    private Long destinatarioId;
    private Integer valor;
    private String motivo;

    public Long getRemetenteId() { return remetenteId; }
    public void setRemetenteId(Long remetenteId) { this.remetenteId = remetenteId; }
    public Long getDestinatarioId() { return destinatarioId; }
    public void setDestinatarioId(Long destinatarioId) { this.destinatarioId = destinatarioId; }
    public Integer getValor() { return valor; }
    public void setValor(Integer valor) { this.valor = valor; }
    public String getMotivo() { return motivo; }
    public void setMotivo(String motivo) { this.motivo = motivo; }
}