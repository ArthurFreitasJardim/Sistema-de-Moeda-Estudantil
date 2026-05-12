package com.pucminas.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import io.micronaut.serde.annotation.Serdeable;

@Serdeable
@Entity
public class Empresa extends Usuario {
    
    @Column(unique = true)
    private String cnpj;

    public String getCnpj() { return cnpj; }
    public void setCnpj(String cnpj) { this.cnpj = cnpj; }
}