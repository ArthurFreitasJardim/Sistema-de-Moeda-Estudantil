package com.pucminas.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import io.micronaut.serde.annotation.Serdeable;

@Serdeable
@Entity
public class Aluno extends Usuario {
    
    @Column(unique = true)
    private String cpf;
    private String rg;
    private String curso;
    private Integer saldoAtual = 0; 

    public String getCpf() { return cpf; }
    public void setCpf(String cpf) { this.cpf = cpf; }
    public String getRg() { return rg; }
    public void setRg(String rg) { this.rg = rg; }
    public String getCurso() { return curso; }
    public void setCurso(String curso) { this.curso = curso; }
    public Integer getSaldoAtual() { return saldoAtual; }
    public void setSaldoAtual(Integer saldoAtual) { this.saldoAtual = saldoAtual; }
}