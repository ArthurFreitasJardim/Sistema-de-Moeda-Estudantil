package com.pucminas.model;

import jakarta.inject.Singleton;
import org.mindrot.jbcrypt.BCrypt;

@Singleton
public class SenhaService {

    public String criptografar(String senha) {
        if (senha == null || senha.isBlank()) {
            throw new IllegalArgumentException("Senha nao pode ser vazia.");
        }

        return BCrypt.hashpw(senha, BCrypt.gensalt(10));
    }

    public boolean senhaConfere(String senhaDigitada, String senhaSalva) {
        if (senhaDigitada == null || senhaDigitada.isBlank()) {
            return false;
        }

        if (senhaSalva == null || senhaSalva.isBlank()) {
            return false;
        }

        if (senhaSalva.startsWith("$2a$") || senhaSalva.startsWith("$2b$") || senhaSalva.startsWith("$2y$")) {
            return BCrypt.checkpw(senhaDigitada, senhaSalva);
        }

        return senhaDigitada.equals(senhaSalva);
    }
}