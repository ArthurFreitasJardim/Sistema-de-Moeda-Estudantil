package com.pucminas.controller;

import com.pucminas.model.Aluno;
import com.pucminas.model.Empresa;
import com.pucminas.model.LoginRequest;
import com.pucminas.model.LoginResponse;
import com.pucminas.model.Professor;
import com.pucminas.model.SenhaService;
import com.pucminas.model.Usuario;
import com.pucminas.repository.UsuarioRepository;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.annotation.Body;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Post;

import java.util.Map;
import java.util.Optional;

@Controller("/auth")
public class AuthController {

    private final UsuarioRepository usuarioRepository;
    private final SenhaService senhaService;

    public AuthController(
            UsuarioRepository usuarioRepository,
            SenhaService senhaService
    ) {
        this.usuarioRepository = usuarioRepository;
        this.senhaService = senhaService;
    }

    @Post("/login")
    public HttpResponse<?> login(@Body LoginRequest request) {
        if (request.email() == null || request.email().isBlank()) {
            return HttpResponse.badRequest(Map.of("message", "E-mail e obrigatorio."));
        }

        if (request.senha() == null || request.senha().isBlank()) {
            return HttpResponse.badRequest(Map.of("message", "Senha e obrigatoria."));
        }

        String email = request.email().trim().toLowerCase();

        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(email);

        if (usuarioOpt.isEmpty()) {
            return HttpResponse.unauthorized();
        }

        Usuario usuario = usuarioOpt.get();

        boolean senhaValida = senhaService.senhaConfere(request.senha(), usuario.getSenha());

        if (!senhaValida) {
            return HttpResponse.unauthorized();
        }

        String tipoUsuario = identificarTipoUsuario(usuario);
        String rota = definirRota(usuario, tipoUsuario);

        LoginResponse response = new LoginResponse(
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail(),
                tipoUsuario,
                rota
        );

        return HttpResponse.ok(response);
    }

    private String identificarTipoUsuario(Usuario usuario) {
        if (usuario instanceof Aluno) {
            return "ALUNO";
        }

        if (usuario instanceof Professor) {
            return "PROFESSOR";
        }

        if (usuario instanceof Empresa) {
            return "EMPRESA";
        }

        return "USUARIO";
    }

    private String definirRota(Usuario usuario, String tipoUsuario) {
        return switch (tipoUsuario) {
            case "ALUNO" -> "/aluno/" + usuario.getId();
            case "PROFESSOR" -> "/professor/" + usuario.getId();
            case "EMPRESA" -> "/empresa?id=" + usuario.getId();
            default -> "/";
        };
    }
}