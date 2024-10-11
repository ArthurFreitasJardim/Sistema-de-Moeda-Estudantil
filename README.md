# Sistema-de-Moeda-Estudantil

---

# Histórias de Usuário

## 1. Cadastro de Aluno
**Como** aluno, **eu quero** me cadastrar no sistema, **para** poder participar e receber moedas dos professores.
- **Critérios de Aceitação**:
  - O aluno deve fornecer nome, e-mail, CPF, RG, endereço, instituição de ensino e curso.
  - A instituição de ensino deve ser selecionada de uma lista pré-cadastrada.

## 2. Cadastro de Professor
**Como** administrador do sistema, **eu quero** pré-cadastrar os professores através das listas fornecidas pelas instituições, **para** que eles possam distribuir moedas aos alunos.
- **Critérios de Aceitação**:
  - O professor deve ser registrado com nome, CPF e departamento, vinculado à instituição de ensino.

## 3. Cadastro de Empresa Parceira
**Como** empresa parceira, **eu quero** me cadastrar no sistema, **para** oferecer vantagens aos alunos em troca de moedas.
- **Critérios de Aceitação**:
  - A empresa deve fornecer nome, e-mail, CNPJ, endereço e descrição das vantagens que deseja oferecer.

## 4. Distribuição de Moedas
**Como** professor, **eu quero** distribuir moedas aos meus alunos, **para** reconhecer seu bom desempenho ou comportamento.
- **Critérios de Aceitação**:
  - O professor deve indicar o aluno, a quantidade de moedas e uma mensagem justificando a distribuição.
  - O professor não pode distribuir mais moedas do que seu saldo disponível.

## 5. Consulta de Extrato de Moedas (Professor)
**Como** professor, **eu quero** consultar meu extrato de moedas, **para** verificar quantas moedas já distribuí e quantas ainda tenho disponíveis.
- **Critérios de Aceitação**:
  - O extrato deve mostrar as transações realizadas e o saldo de moedas do professor.

## 6. Consulta de Extrato de Moedas (Aluno)
**Como** aluno, **eu quero** consultar meu saldo de moedas e o histórico de transações, **para** acompanhar o quanto recebi e gastei.
- **Critérios de Aceitação**:
  - O aluno deve ver seu saldo atual e o histórico de transações (recebimento e troca de moedas).

## 7. Troca de Moedas por Vantagens
**Como** aluno, **eu quero** trocar minhas moedas por vantagens oferecidas pelas empresas parceiras, **para** usufruir dos benefícios.
- **Critérios de Aceitação**:
  - O aluno deve selecionar uma vantagem cadastrada e ter o saldo necessário para a troca.
  - O sistema deve descontar as moedas do saldo do aluno.

## 8. Cadastro de Vantagens
**Como** empresa parceira, **eu quero** cadastrar vantagens no sistema, **para** oferecer produtos e descontos em troca de moedas estudantis.
- **Critérios de Aceitação**:
  - A empresa deve adicionar uma descrição da vantagem, uma foto e o custo em moedas.

## 9. Notificação de Recebimento de Moedas
**Como** aluno, **eu quero** ser notificado por e-mail sempre que receber moedas de um professor, **para** saber que fui reconhecido e premiado.
- **Critérios de Aceitação**:
  - O sistema deve enviar uma notificação por e-mail sempre que o aluno receber moedas.

## 10. Notificação de Resgate de Vantagem
**Como** aluno, **eu quero** receber um e-mail com um código de cupom após resgatar uma vantagem, **para** utilizar esse cupom na empresa parceira.
- **Critérios de Aceitação**:
  - O sistema deve gerar e enviar um e-mail com o código do cupom ao aluno e uma notificação para a empresa parceira.

## 11. Autenticação de Usuário
**Como** aluno/professor/empresa parceira, **eu quero** realizar login no sistema, **para** acessar minha conta com segurança.
- **Critérios de Aceitação**:
  - O sistema deve exigir login e senha para acessar as funcionalidades.

## 12. Geração de Cupom de Resgate
**Como** sistema, **eu quero** gerar um código de cupom único, **para** que o aluno possa utilizá-lo ao resgatar uma vantagem nas empresas parceiras.
- **Critérios de Aceitação**:
  - O sistema deve gerar um código único e enviá-lo para o aluno e a empresa parceira.
