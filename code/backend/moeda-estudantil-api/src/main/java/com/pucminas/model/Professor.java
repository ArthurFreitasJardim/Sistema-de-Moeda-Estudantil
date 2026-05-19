package com.pucminas.model;

import jakarta.persistence.*;
import io.micronaut.serde.annotation.Serdeable;

@Serdeable
@Entity
public class Professor extends Usuario {
    private String cpf;
    private String departamento;
    private Integer saldoCorrente = 1000;

    @ManyToOne
    private Instituicao instituicao;

    public String getCpf() { return cpf; }
    public void setCpf(String cpf) { this.cpf = cpf; }
    public String getDepartamento() { return departamento; }
    public void setDepartamento(String departamento) { this.departamento = departamento; }
    public Integer getSaldoCorrente() { return saldoCorrente; }
    public void setSaldoCorrente(Integer saldoCorrente) { this.saldoCorrente = saldoCorrente; }
    public Instituicao getInstituicao() { return instituicao; }
    public void setInstituicao(Instituicao instituicao) { this.instituicao = instituicao; }
}