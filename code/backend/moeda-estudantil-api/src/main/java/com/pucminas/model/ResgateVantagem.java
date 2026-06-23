package com.pucminas.model;

import io.micronaut.serde.annotation.Serdeable;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Serdeable
@Entity
@Table(name = "resgate_vantagem")
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

    @Column(nullable = false, unique = true)
    private String codigoCupom;

    @Column(nullable = false)
    private LocalDateTime dataHora = LocalDateTime.now();

    public ResgateVantagem() {
    }

    public ResgateVantagem(Aluno aluno, Vantagem vantagem, Integer valorMoedas, String codigoCupom) {
        this.aluno = aluno;
        this.vantagem = vantagem;
        this.valorMoedas = valorMoedas;
        this.codigoCupom = codigoCupom;
        this.dataHora = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public Aluno getAluno() {
        return aluno;
    }

    public void setAluno(Aluno aluno) {
        this.aluno = aluno;
    }

    public Vantagem getVantagem() {
        return vantagem;
    }

    public void setVantagem(Vantagem vantagem) {
        this.vantagem = vantagem;
    }

    public Integer getValorMoedas() {
        return valorMoedas;
    }

    public void setValorMoedas(Integer valorMoedas) {
        this.valorMoedas = valorMoedas;
    }

    public String getCodigoCupom() {
        return codigoCupom;
    }

    public void setCodigoCupom(String codigoCupom) {
        this.codigoCupom = codigoCupom;
    }

    public LocalDateTime getDataHora() {
        return dataHora;
    }

    public void setDataHora(LocalDateTime dataHora) {
        this.dataHora = dataHora;
    }
}