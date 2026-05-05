# Histórias de Usuário - Sistema de Moeda Estudantil (Release 1)

## 1. Gestão de Perfis e Acesso

### US01 - Cadastro de Aluno
**Como** aluno,  
**quero** realizar meu cadastro no sistema informando meus dados pessoais (Nome, Email, CPF, RG, Endereço, Instituição e Curso),  
**para que** eu possa começar a acumular moedas de mérito[cite: 1].

*   **Critérios de Aceitação:**
    *   O sistema deve permitir a seleção de uma Instituição de Ensino já pré-cadastrada[cite: 1].
    *   Todos os campos citados na descrição são obrigatórios para a conclusão do registro[cite: 1].
    *   O aluno deve definir uma senha para garantir a segurança de seu acesso.

### US02 - Cadastro de Empresa Parceira
**Como** representante de uma empresa,  
**quero** cadastrar minha organização e as vantagens oferecidas,  
**para que** eu possa atrair alunos e validar as trocas de moedas.

*   **Critérios de Aceitação:**
    *   A empresa deve obrigatoriamente incluir descrição e foto para cada vantagem cadastrada.
    *   Deve haver um custo em moedas definido para cada benefício.

### US03 - Autenticação e Segurança
**Como** usuário do sistema (Aluno, Professor ou Empresa),  
**quero** realizar login com e-mail e senha,  
**para que** minhas transações e dados pessoais fiquem protegidos.

*   **Critérios de Aceitação:**
    *   O sistema deve exigir autenticação para qualquer operação de consulta ou movimentação.

---

## 2. Movimentação e Gestão de Moedas

### US04 - Distribuição de Mérito (Professor)
**Como** professor,  
**quero** enviar moedas para um aluno específico, indicando o valor e o motivo,  
**para** reconhecer sua participação ou bom comportamento em aula[cite: 1].

*   **Critérios de Aceitação:**
    *   O professor deve possuir saldo suficiente no momento do envio[cite: 1].
    *   A mensagem de motivo é de preenchimento obrigatório[cite: 1].
    *   O sistema deve disparar automaticamente um e-mail de notificação para o aluno ao receber a moeda.

### US05 - Gestão de Saldo Semestral
**Como** professor,  
**quero** que meu saldo seja incrementado em 1.000 moedas a cada novo semestre,  
**para que** eu tenha recursos para premiar novas turmas[cite: 1].

*   **Critérios de Aceitação:**
    *   O saldo não utilizado no semestre anterior deve ser acumulado com o novo aporte de 1.000 moedas[cite: 1].

### US06 - Consulta de Extrato e Saldo
**Como** aluno ou professor,  
**quero** visualizar meu extrato detalhado,  
**para que** eu possa acompanhar o histórico de envios, recebimentos ou trocas.

*   **Critérios de Aceitação:**
    *   O professor visualiza apenas os envios realizados por ele.
    *   O aluno visualiza tanto as moedas recebidas quanto as gastas em vantagens.

---

## 3. Resgate de Benefícios

### US07 - Troca de Moedas por Vantagens
**Como** aluno,  
**quero** selecionar uma vantagem do catálogo e trocá-la por minhas moedas acumuladas,  
**para** obter descontos ou materiais de meu interesse.

*   **Critérios de Aceitação:**
    *   O valor da vantagem deve ser debitado instantaneamente do saldo do aluno.
    *   O sistema deve gerar um código único para facilitar a conferência presencial.

### US08 - Notificação de Resgate e Cupom
**Como** usuário envolvido na troca (Aluno ou Empresa),  
**quero** receber um e-mail com os detalhes do resgate,  
**para que** o processo de conferência e entrega do produto seja validado.

*   **Critérios de Aceitação:**
    *   O aluno deve receber um e-mail contendo o cupom para uso presencial.
    *   A empresa parceira deve receber um e-mail de notificação para conferir a legitimidade da troca através do código gerado.