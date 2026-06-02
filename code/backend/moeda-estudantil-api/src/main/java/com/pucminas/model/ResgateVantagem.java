package com.pucminas.model;

import io.micronaut.serde.annotation.Serdeable;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Serdeable
@Entity
public class ResgateVantagem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private Aluno aluno;

    @ManyToOne(optional = false)
    private Vantagem vantagem;

    @Column(nullable = false)
    private Integer valorMoedas;

    @Column(nullable = false)
    private LocalDateTime dataHora = LocalDateTime.now();

    public Long getId() {
        return id;
    }

    public Aluno getAluno() {
        return aluno;
    }

    public Vantagem getVantagem() {
        return vantagem;
    }

    public Integer getValorMoedas() {
        return valorMoedas;
    }

    public LocalDateTime getDataHora() {
        return dataHora;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setAluno(Aluno aluno) {
        this.aluno = aluno;
    }

    public void setVantagem(Vantagem vantagem) {
        this.vantagem = vantagem;
    }

    public void setValorMoedas(Integer valorMoedas) {
        this.valorMoedas = valorMoedas;
    }

    public void setDataHora(LocalDateTime dataHora) {
        this.dataHora = dataHora;
    }
}