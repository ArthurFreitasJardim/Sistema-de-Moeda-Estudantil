package com.pucminas.controller;

import com.pucminas.model.Instituicao;
import com.pucminas.model.Professor;
import com.pucminas.model.SenhaService;
import com.pucminas.repository.InstituicaoRepository;
import com.pucminas.repository.ProfessorRepository;
import io.micronaut.core.annotation.Introspected;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.MediaType;
import io.micronaut.http.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.StreamSupport;

@Controller("/professores")
public class ProfessorController {

    private final ProfessorRepository repository;
    private final InstituicaoRepository instituicaoRepository;
    private final SenhaService senhaService;

    public ProfessorController(
            ProfessorRepository repository,
            InstituicaoRepository instituicaoRepository,
            SenhaService senhaService
    ) {
        this.repository = repository;
        this.instituicaoRepository = instituicaoRepository;
        this.senhaService = senhaService;
    }

    @Get(produces = MediaType.APPLICATION_JSON)
    public List<ProfessorApiResponse> listarTodos() {
        return StreamSupport.stream(repository.findAll().spliterator(), false)
                .map(this::toResponse)
                .toList();
    }

    @Get(uri = "/{id}", produces = MediaType.APPLICATION_JSON)
    public HttpResponse<?> buscarPorId(@PathVariable Long id) {
        Optional<Professor> professorOptional = repository.findById(id);

        if (professorOptional.isEmpty()) {
            return HttpResponse.notFound(new ErroApiResponse("Professor não encontrado."));
        }

        return HttpResponse.ok(toResponse(professorOptional.get()));
    }

    @Post(consumes = MediaType.APPLICATION_JSON, produces = MediaType.APPLICATION_JSON)
    public HttpResponse<?> criar(@Body CriarProfessorRequest request) {
        try {
            if (request == null) {
                return HttpResponse.badRequest(new ErroApiResponse("Dados do professor não foram enviados."));
            }

            if (
                    request.nome() == null || request.nome().isBlank() ||
                    request.email() == null || request.email().isBlank() ||
                    request.senha() == null || request.senha().isBlank() ||
                    request.cpf() == null || request.cpf().isBlank() ||
                    request.departamento() == null || request.departamento().isBlank()
            ) {
                return HttpResponse.badRequest(
                        new ErroApiResponse("Nome, e-mail, senha, CPF e departamento são obrigatórios.")
                );
            }

            String emailNormalizado = request.email().trim().toLowerCase();

            boolean emailJaCadastrado = StreamSupport.stream(repository.findAll().spliterator(), false)
                    .anyMatch(professor ->
                            professor.getEmail() != null &&
                            professor.getEmail().equalsIgnoreCase(emailNormalizado)
                    );

            if (emailJaCadastrado) {
                return HttpResponse.badRequest(new ErroApiResponse("Já existe um professor com este e-mail."));
            }

            String nomeInstituicao = null;

            if (request.instituicaoNome() != null && !request.instituicaoNome().isBlank()) {
                nomeInstituicao = request.instituicaoNome();
            } else if (request.instituicao() != null && !request.instituicao().isBlank()) {
                nomeInstituicao = request.instituicao();
            }

            Instituicao instituicao = buscarOuCriarInstituicao(nomeInstituicao);

            Professor professor = new Professor();
            professor.setNome(request.nome().trim());
            professor.setEmail(emailNormalizado);
            professor.setSenha(senhaService.criptografar(request.senha()));
            professor.setCpf(request.cpf().replaceAll("\\D", ""));
            professor.setDepartamento(request.departamento().trim());
            professor.setSaldoCorrente(1000);
            professor.setInstituicao(instituicao);

            Professor professorSalvo = repository.save(professor);

            return HttpResponse.created(toResponse(professorSalvo));
        } catch (Exception exception) {
            exception.printStackTrace();
            return HttpResponse.serverError(
                    new ErroApiResponse("Erro ao cadastrar professor: " + exception.getMessage())
            );
        }
    }

    @Delete(uri = "/{id}", produces = MediaType.APPLICATION_JSON)
    public HttpResponse<?> deletar(@PathVariable Long id) {
        Optional<Professor> professorOptional = repository.findById(id);

        if (professorOptional.isEmpty()) {
            return HttpResponse.notFound(new ErroApiResponse("Professor não encontrado."));
        }

        repository.delete(professorOptional.get());

        return HttpResponse.ok(new MensagemApiResponse("Professor excluído com sucesso."));
    }

    private Instituicao buscarOuCriarInstituicao(String instituicaoNome) {
        if (instituicaoNome == null || instituicaoNome.isBlank()) {
            return null;
        }

        String nomeInstituicao = instituicaoNome.trim();

        return StreamSupport.stream(instituicaoRepository.findAll().spliterator(), false)
                .filter(instituicao ->
                        instituicao.getNome() != null &&
                        instituicao.getNome().equalsIgnoreCase(nomeInstituicao)
                )
                .findFirst()
                .orElseGet(() -> {
                    Instituicao novaInstituicao = new Instituicao();
                    novaInstituicao.setNome(nomeInstituicao);
                    return instituicaoRepository.save(novaInstituicao);
                });
    }

    private ProfessorApiResponse toResponse(Professor professor) {
        String instituicaoNome = null;

        if (professor.getInstituicao() != null) {
            instituicaoNome = professor.getInstituicao().getNome();
        }

        return new ProfessorApiResponse(
                professor.getId(),
                professor.getNome(),
                professor.getEmail(),
                professor.getCpf(),
                professor.getDepartamento(),
                professor.getSaldoCorrente(),
                instituicaoNome
        );
    }

    @Introspected
    public record CriarProfessorRequest(
            String nome,
            String email,
            String senha,
            String cpf,
            String departamento,
            String instituicaoNome,
            String instituicao
    ) {
    }

    @Introspected
    public record ProfessorApiResponse(
            Long id,
            String nome,
            String email,
            String cpf,
            String departamento,
            Integer saldoCorrente,
            String instituicaoNome
    ) {
    }

    @Introspected
    public record ErroApiResponse(
            String erro
    ) {
    }

    @Introspected
    public record MensagemApiResponse(
            String mensagem
    ) {
    }
}