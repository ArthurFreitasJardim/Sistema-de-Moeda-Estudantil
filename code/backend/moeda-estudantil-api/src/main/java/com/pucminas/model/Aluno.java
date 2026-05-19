package com.pucminas.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import io.micronaut.serde.annotation.Serdeable;
import jakarta.validation.constraints.NotBlank;

@Serdeable
@Entity
public class Aluno extends Usuario {

    @NotBlank
    @Column(unique = true, nullable = false)
    private String cpf;

    @NotBlank
    @Column(nullable = false)
    private String rg;

    @NotBlank
    @Column(nullable = false)
    private String curso;

    @ManyToOne
    private Instituicao instituicao;

    private Integer saldoAtual = 0;

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public String getRg() {
        return rg;
    }

    public void setRg(String rg) {
        this.rg = rg;
    }

    public String getCurso() {
        return curso;
    }

    public void setCurso(String curso) {
        this.curso = curso;
    }

    public Instituicao getInstituicao() {
        return instituicao;
    }

    public void setInstituicao(Instituicao instituicao) {
        this.instituicao = instituicao;
    }

    public Integer getSaldoAtual() {
        return saldoAtual;
    }

    public void setSaldoAtual(Integer saldoAtual) {
        this.saldoAtual = saldoAtual;
    }
}