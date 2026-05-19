package com.pucminas.controller;

import com.pucminas.dto.AlunoResponse;
import com.pucminas.dto.CriarAlunoRequest;
import com.pucminas.dto.ErroResponse;
import com.pucminas.model.Aluno;
import com.pucminas.model.Instituicao;
import com.pucminas.model.Professor;
import com.pucminas.repository.AlunoRepository;
import com.pucminas.repository.InstituicaoRepository;
import com.pucminas.repository.ProfessorRepository;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.MediaType;
import io.micronaut.http.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.StreamSupport;

@Controller("/alunos")
public class AlunoController {

    private final AlunoRepository alunoRepository;
    private final InstituicaoRepository instituicaoRepository;
    private final ProfessorRepository professorRepository;

    public AlunoController(
            AlunoRepository alunoRepository,
            InstituicaoRepository instituicaoRepository,
            ProfessorRepository professorRepository
    ) {
        this.alunoRepository = alunoRepository;
        this.instituicaoRepository = instituicaoRepository;
        this.professorRepository = professorRepository;
    }

    @Get(produces = MediaType.APPLICATION_JSON)
    public List<AlunoResponse> listar() {
        return StreamSupport.stream(alunoRepository.findAll().spliterator(), false)
                .map(this::toResponse)
                .toList();
    }

    @Get(uri = "/professor/{professorId}", produces = MediaType.APPLICATION_JSON)
    public HttpResponse<?> listarPorProfessor(@PathVariable Long professorId) {
        Optional<Professor> professorOptional = professorRepository.findById(professorId);

        if (professorOptional.isEmpty()) {
            return HttpResponse.notFound(new ErroResponse("Professor não encontrado"));
        }

        Professor professor = professorOptional.get();

        String departamentoProfessor = professor.getDepartamento();
        String instituicaoProfessor = professor.getInstituicao() != null
                ? professor.getInstituicao().getNome()
                : null;

        if (departamentoProfessor == null || instituicaoProfessor == null) {
            return HttpResponse.ok(List.of());
        }

        List<AlunoResponse> alunosFiltrados = StreamSupport.stream(alunoRepository.findAll().spliterator(), false)
                .filter(aluno -> pertenceAoMesmoCursoEInstituicao(aluno, departamentoProfessor, instituicaoProfessor))
                .map(this::toResponse)
                .toList();

        return HttpResponse.ok(alunosFiltrados);
    }

    @Post(consumes = MediaType.APPLICATION_JSON, produces = MediaType.APPLICATION_JSON)
    public HttpResponse<?> criar(@Body CriarAlunoRequest request) {
        try {
            if (
                    request.nome() == null || request.nome().isBlank() ||
                    request.email() == null || request.email().isBlank() ||
                    request.senha() == null || request.senha().isBlank() ||
                    request.cpf() == null || request.cpf().isBlank() ||
                    request.rg() == null || request.rg().isBlank() ||
                    request.curso() == null || request.curso().isBlank() ||
                    request.instituicaoNome() == null || request.instituicaoNome().isBlank()
            ) {
                return HttpResponse.badRequest(new ErroResponse("Todos os campos do aluno são obrigatórios"));
            }

            String instituicaoNome = request.instituicaoNome().trim();

            Instituicao instituicao = instituicaoRepository.findByNome(instituicaoNome)
                    .orElseGet(() -> {
                        Instituicao novaInstituicao = new Instituicao();
                        novaInstituicao.setNome(instituicaoNome);
                        return instituicaoRepository.save(novaInstituicao);
                    });

            Aluno aluno = new Aluno();
            aluno.setNome(request.nome().trim());
            aluno.setEmail(request.email().trim().toLowerCase());
            aluno.setSenha(request.senha());
            aluno.setCpf(request.cpf().trim());
            aluno.setRg(request.rg().trim());
            aluno.setCurso(request.curso().trim());
            aluno.setInstituicao(instituicao);
            aluno.setSaldoAtual(0);

            Aluno alunoSalvo = alunoRepository.save(aluno);

            return HttpResponse.created(toResponse(alunoSalvo));

        } catch (Exception e) {
            return HttpResponse.serverError(new ErroResponse(e.getMessage()));
        }
    }

    @Delete("/{id}")
    public HttpResponse<?> deletar(@PathVariable Long id) {
        Optional<Aluno> aluno = alunoRepository.findById(id);

        if (aluno.isPresent()) {
            alunoRepository.delete(aluno.get());
            return HttpResponse.ok();
        }

        return HttpResponse.notFound(new ErroResponse("Aluno não encontrado"));
    }

    private boolean pertenceAoMesmoCursoEInstituicao(
            Aluno aluno,
            String departamentoProfessor,
            String instituicaoProfessor
    ) {
        if (
                aluno.getCurso() == null ||
                aluno.getInstituicao() == null ||
                aluno.getInstituicao().getNome() == null
        ) {
            return false;
        }

        return aluno.getCurso().equals(departamentoProfessor)
                && aluno.getInstituicao().getNome().equals(instituicaoProfessor);
    }

    private AlunoResponse toResponse(Aluno aluno) {
        String instituicaoNome = aluno.getInstituicao() != null
                ? aluno.getInstituicao().getNome()
                : "";

        return new AlunoResponse(
                aluno.getId(),
                aluno.getNome(),
                aluno.getEmail(),
                aluno.getCpf(),
                aluno.getRg(),
                aluno.getCurso(),
                instituicaoNome,
                aluno.getSaldoAtual()
        );
    }
}