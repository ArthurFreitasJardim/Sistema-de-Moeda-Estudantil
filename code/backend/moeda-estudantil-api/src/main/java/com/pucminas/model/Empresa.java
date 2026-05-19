package com.pucminas.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import io.micronaut.serde.annotation.Serdeable;
import jakarta.validation.constraints.NotBlank;

@Serdeable
@Entity
public class Empresa extends Usuario {
    
    @NotBlank
    @Column(unique = true, nullable = false)
    private String cnpj;

    public String getCnpj() { return cnpj; }
    public void setCnpj(String cnpj) { this.cnpj = cnpj; }
}