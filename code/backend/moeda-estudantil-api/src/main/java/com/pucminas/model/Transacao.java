package com.pucminas.model;

import jakarta.persistence.*;
import io.micronaut.serde.annotation.Serdeable;
import java.time.LocalDateTime;

@Serdeable
@Entity
public class Transacao {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Professor remetente;

    @ManyToOne
    private Aluno destinatario;

    private Integer valor;

    @Column(nullable = false)
    private String motivo; 
    private LocalDateTime dataHora = LocalDateTime.now();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Professor getRemetente() { return remetente; }
    public void setRemetente(Professor remetente) { this.remetente = remetente; }
    public Aluno getDestinatario() { return destinatario; }
    public void setDestinatario(Aluno destinatario) { this.destinatario = destinatario; }
    public Integer getValor() { return valor; }
    public void setValor(Integer valor) { this.valor = valor; }
    public String getMotivo() { return motivo; }
    public void setMotivo(String motivo) { this.motivo = motivo; }
    public LocalDateTime getDataHora() { return dataHora; }
    public void setDataHora(LocalDateTime dataHora) { this.dataHora = dataHora; }
}