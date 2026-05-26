# Sistema de Moeda Estudantil

Projeto desenvolvido para a disciplina de Laboratório de Desenvolvimento de Software, com o objetivo de criar um sistema de moedas estudantis, no qual professores podem reconhecer alunos por meio do envio de moedas, e empresas parceiras podem cadastrar vantagens que futuramente poderão ser resgatadas pelos alunos.

## Objetivo do Projeto

O sistema tem como proposta incentivar o desempenho acadêmico dos alunos por meio de uma moeda virtual. Professores podem distribuir moedas para alunos vinculados ao mesmo curso e instituição, enquanto empresas parceiras podem cadastrar vantagens que serão disponibilizadas para troca por essas moedas.

Até o momento, o projeto contempla:

- CRUD de alunos.
- CRUD de empresas parceiras.
- Cadastro de professor pré-definido.
- Envio de moedas de professor para aluno.
- Histórico de transações realizadas pelo professor.
- Cadastro de vantagens por empresas parceiras.
- Filtro de alunos por curso e instituição do professor.
- Integração entre front-end e back-end via API REST.

---

## Tecnologias Utilizadas

### Back-end

- Java
- Micronaut 4
- Micronaut Data
- JPA / Hibernate
- Banco de dados relacional
- API REST
- DTOs para padronização dos dados

### Front-end

- Next.js
- React
- TypeScript
- Tailwind CSS
- Fetch API para comunicação com o back-end

---

## Arquitetura do Sistema

O sistema segue uma arquitetura dividida entre front-end e back-end.

O front-end em Next.js é responsável pela interface do usuário e pela chamada dos endpoints da API.

O back-end em Micronaut 4 é responsável por processar as regras de negócio, validar dados, acessar o banco de dados e retornar respostas padronizadas para o front-end.

Fluxo geral:

```txt
Usuário → Front-end Next.js → API REST Micronaut → Repositories → Banco de Dados
```

---

## Estrutura Principal do Back-end

O back-end está organizado em camadas:

```txt
controller/
dto/
model/
repository/
```

### Controller

Responsável por receber as requisições HTTP, chamar os repositories, aplicar regras de negócio e retornar respostas para o front-end.

Exemplos:

- `AlunoController`
- `ProfessorController`
- `EmpresaController`
- `TransacaoController`
- `VantagemController`

### DTO

Os DTOs são usados para padronizar os dados enviados e recebidos pela API.

Eles foram adotados porque, durante o desenvolvimento, retornar entidades diretamente causava problemas de serialização, objetos vazios e incompatibilidade com o front-end.

Exemplos:

- `AlunoResponse`
- `ProfessorResponse`
- `EmpresaResponse`
- `VantagemResponse`
- `CriarAlunoRequest`
- `CriarEmpresaRequest`
- `CriarTransacaoRequest`
- `CriarVantagemRequest`
- `ErroResponse`
- `StatusResponse`

### Model

Contém as entidades persistidas no banco.

Entidades principais:

- `Usuario`
- `Aluno`
- `Professor`
- `Empresa`
- `Instituicao`
- `Transacao`
- `Vantagem`

### Repository

Responsável pela comunicação com o banco de dados utilizando Micronaut Data.

Exemplos:

- `AlunoRepository`
- `ProfessorRepository`
- `EmpresaRepository`
- `InstituicaoRepository`
- `TransacaoRepository`
- `VantagemRepository`

---

## Camada de Persistência

O projeto utiliza JPA/Hibernate para persistência dos dados.

A entidade `Usuario` é uma classe abstrata que concentra dados comuns entre os tipos de usuário:

- `id`
- `nome`
- `email`
- `senha`

As entidades `Aluno`, `Professor` e `Empresa` herdam de `Usuario`.

A estratégia de herança utilizada é:

```java
@Inheritance(strategy = InheritanceType.JOINED)
```

Com isso, os dados comuns ficam na tabela `usuario`, enquanto os dados específicos ficam nas tabelas próprias.

Exemplo:

```txt
usuario
├── aluno
├── professor
└── empresa
```

---

## Entidades do Sistema

### Usuario

Representa os dados comuns de todos os usuários.

Campos principais:

- id
- nome
- email
- senha

### Aluno

Representa o aluno cadastrado no sistema.

Campos principais:

- cpf
- rg
- curso
- instituição
- saldoAtual

O aluno só aparece para o professor caso tenha o mesmo curso e a mesma instituição do professor.

### Professor

Representa o professor responsável por distribuir moedas.

Campos principais:

- cpf
- departamento
- instituição
- saldoCorrente

Atualmente, o professor é pré-cadastrado no banco por meio de script SQL.

O campo `departamento` está sendo utilizado como equivalente ao curso do professor.

### Empresa

Representa uma empresa parceira.

Campos principais:

- cnpj
- nome
- email
- senha

A empresa pode acessar seu painel e cadastrar vantagens.

### Instituicao

Representa a instituição de ensino.

Campos principais:

- id
- nome

### Transacao

Representa o envio de moedas de um professor para um aluno.

Campos principais:

- remetente
- destinatario
- valor
- motivo
- dataHora

### Vantagem

Representa uma vantagem cadastrada por uma empresa parceira.

Campos principais:

- nome
- descrição
- valorMoedas
- empresa

---

## Regras de Negócio Implementadas

### Filtro de Alunos por Professor

O professor só pode visualizar alunos que pertençam ao mesmo curso e à mesma instituição.

A comparação atual é feita da seguinte forma:

```txt
aluno.curso == professor.departamento
aluno.instituicao.nome == professor.instituicao.nome
```

Exemplo:

```txt
Professor:
Instituição: PUC Minas
Departamento: Engenharia de Software

Aluno:
Instituição: PUC Minas
Curso: Engenharia de Software
```

Nesse caso, o aluno aparece no painel do professor.

Caso o curso ou a instituição estejam diferentes, o aluno não aparece.

---

### Envio de Moedas

O professor pode enviar moedas para um aluno disponível em seu painel.

Para enviar moedas, são necessários:

- aluno destinatário
- quantidade de moedas
- motivo do reconhecimento

O sistema valida:

- se o professor existe
- se o aluno existe
- se o aluno pertence ao mesmo curso e instituição do professor
- se o professor possui saldo suficiente
- se o valor informado é válido

Após o envio:

- o saldo do professor é reduzido
- o saldo do aluno é aumentado
- a transação é registrada no histórico

---

### Cadastro de Empresas Parceiras

Empresas parceiras podem ser cadastradas com:

- nome
- e-mail
- CNPJ
- senha padrão

Como o sistema ainda não possui login, o acesso provisório ao painel da empresa é feito clicando sobre a empresa listada na tela principal.

---

### Cadastro de Vantagens

Cada empresa pode cadastrar suas próprias vantagens.

Uma vantagem possui:

- nome
- descrição
- quantidade de moedas necessárias
- empresa responsável

O painel da empresa lista apenas as vantagens vinculadas à empresa selecionada.

---

## Endpoints Principais

### Alunos

```txt
GET /alunos
POST /alunos
DELETE /alunos/{id}
GET /alunos/professor/{professorId}
```

### Professores

```txt
GET /professores
```

### Empresas

```txt
GET /empresas
GET /empresas/{id}
POST /empresas
DELETE /empresas/{id}
```

### Transações

```txt
GET /transacoes/professor/{professorId}
POST /transacoes
```

### Vantagens

```txt
GET /vantagens
GET /vantagens/empresa/{empresaId}
POST /vantagens
DELETE /vantagens/{id}
```

---

## Telas Implementadas

### Tela Principal

A tela principal permite:

- cadastrar alunos
- cadastrar empresas parceiras
- listar alunos cadastrados
- listar empresas parceiras
- excluir alunos
- excluir empresas
- acessar o painel de uma empresa ao clicar nela

---

### Painel do Professor

A tela do professor permite:

- visualizar o professor pré-cadastrado
- visualizar seu saldo disponível
- listar apenas alunos do mesmo curso e instituição
- enviar moedas para alunos
- visualizar histórico de envios

---

### Painel da Empresa

A tela da empresa permite:

- visualizar os dados da empresa selecionada
- cadastrar vantagens
- listar vantagens cadastradas pela empresa
- excluir vantagens

---

## Professor Pré-cadastrado

Atualmente, o professor é inserido diretamente no banco pelo script SQL.

Exemplo de `import.sql`:

```sql
INSERT INTO instituicao (id, nome)
VALUES (1, 'PUC Minas')
ON CONFLICT DO NOTHING;

INSERT INTO usuario (id, nome, email, senha)
VALUES (1, 'Joao Paulo Aramuni', 'joao@pucminas.br', '123')
ON CONFLICT DO NOTHING;

INSERT INTO professor (id, cpf, departamento, instituicao_id, saldo_corrente)
VALUES (1, '12345678901', 'Engenharia de Software', 1, 1000)
ON CONFLICT DO NOTHING;
```

---

## Como Zerar o Banco e Recriar o Professor

Para reiniciar o banco de dados e manter apenas o professor pré-cadastrado, execute manualmente no gerenciador de banco:

```sql
TRUNCATE TABLE transacao RESTART IDENTITY CASCADE;
TRUNCATE TABLE aluno RESTART IDENTITY CASCADE;
TRUNCATE TABLE professor RESTART IDENTITY CASCADE;
TRUNCATE TABLE empresa RESTART IDENTITY CASCADE;
TRUNCATE TABLE usuario RESTART IDENTITY CASCADE;
TRUNCATE TABLE instituicao RESTART IDENTITY CASCADE;

INSERT INTO instituicao (id, nome)
VALUES (1, 'PUC Minas')
ON CONFLICT DO NOTHING;

INSERT INTO usuario (id, nome, email, senha)
VALUES (1, 'Joao Paulo Aramuni', 'joao@pucminas.br', '123')
ON CONFLICT DO NOTHING;

INSERT INTO professor (id, cpf, departamento, instituicao_id, saldo_corrente)
VALUES (1, '12345678901', 'Engenharia de Software', 1, 1000)
ON CONFLICT DO NOTHING;
```

Se a tabela `empresa` ainda não existir no banco, remova a linha:

```sql
TRUNCATE TABLE empresa RESTART IDENTITY CASCADE;
```

---

## Decisões Técnicas Importantes

### Uso de DTOs

Durante o desenvolvimento, foram encontrados problemas ao retornar entidades diretamente do back-end para o front-end.

Entre os problemas estavam:

- objetos vazios na resposta JSON
- conflitos de serialização
- campos vindo em formatos inesperados
- problemas no front-end ao usar `.map()`
- exposição desnecessária da estrutura interna das entidades

Para resolver isso, foram criados DTOs.

Os DTOs garantem que o back-end envie exatamente os campos que o front-end precisa.

Exemplo:

```java
public record ProfessorResponse(
    Long id,
    String nome,
    String departamento,
    String instituicaoNome,
    Integer saldoCorrente
) {}
```

Essa abordagem deixou o contrato entre front-end e back-end mais estável e previsível.

---

### Uso de Herança JOINED

A herança entre `Usuario`, `Aluno`, `Professor` e `Empresa` foi modelada com `JOINED`.

Isso permite reaproveitar dados comuns de usuário sem duplicação.

Dados comuns:

- nome
- e-mail
- senha

Dados específicos:

- aluno: CPF, RG, curso, saldo e instituição
- professor: CPF, departamento, saldo e instituição
- empresa: CNPJ

---

### Acesso Provisório ao Painel da Empresa

Como ainda não existe autenticação, o painel da empresa é acessado provisoriamente pelo ID da empresa na URL.

Exemplo:

```txt
/empresa?id=2
```

Essa decisão foi tomada para permitir o desenvolvimento e teste do fluxo de vantagens antes da implementação do login.

---

## Como Executar o Projeto

### Back-end

Entre na pasta do back-end e execute:

```bash
gradlew run
```

ou:

```bash
./gradlew run
```

A API ficará disponível em:

```txt
http://localhost:8080
```

---

### Front-end

Entre na pasta do front-end e execute:

```bash
npm install
npm run dev
```

O front-end ficará disponível em:

```txt
http://localhost:3000
```

---

## Testes Manuais Recomendados

### Teste do Professor

1. Acesse:

```txt
http://localhost:3000/professor
```

2. Verifique se o professor aparece com saldo.

3. Cadastre um aluno com:

```txt
Curso: Engenharia de Software
Instituição: PUC Minas
```

4. Verifique se o aluno aparece no painel do professor.

5. Envie moedas e confira o histórico.

---

### Teste da Empresa

1. Acesse:

```txt
http://localhost:3000
```

2. Cadastre uma empresa parceira.

3. Clique na empresa cadastrada.

4. Acesse o painel da empresa.

5. Cadastre uma vantagem com nome, descrição e quantidade de moedas.

6. Verifique se a vantagem aparece na listagem.

---

## Rotas do Front-end

### Tela principal

```txt
http://localhost:3000
```

### Painel do professor

```txt
http://localhost:3000/professor
```

### Painel da empresa

```txt
http://localhost:3000/empresa?id={idDaEmpresa}
```

Exemplo:

```txt
http://localhost:3000/empresa?id=2
```

---

## Próximas Etapas

As próximas evoluções previstas para o sistema são:

- implementação de login
- autenticação por tipo de usuário
- painel do aluno
- listagem de vantagens disponíveis para o aluno
- resgate de vantagens com moedas
- controle de estoque ou disponibilidade de vantagens
- envio de notificações
- melhoria das validações
- criação de testes automatizados
- melhoria visual e responsividade das telas

---

## Status Atual

O sistema atualmente possui os CRUDs principais funcionando, integração entre front-end e back-end, regras de negócio para visualização de alunos pelo professor, envio de moedas e cadastro de vantagens por empresas parceiras.

A arquitetura foi organizada com separação entre entidades, repositories, controllers e DTOs, garantindo uma base mais estável para as próximas etapas do projeto.