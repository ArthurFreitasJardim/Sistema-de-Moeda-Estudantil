TRUNCATE TABLE transacao RESTART IDENTITY CASCADE;
TRUNCATE TABLE vantagem RESTART IDENTITY CASCADE;
TRUNCATE TABLE aluno RESTART IDENTITY CASCADE;
TRUNCATE TABLE professor RESTART IDENTITY CASCADE;
TRUNCATE TABLE empresa RESTART IDENTITY CASCADE;
TRUNCATE TABLE usuario RESTART IDENTITY CASCADE;
TRUNCATE TABLE instituicao RESTART IDENTITY CASCADE;


INSERT INTO instituicao (id, nome)
VALUES (1, 'PUC Minas')
ON CONFLICT DO NOTHING;

INSERT INTO usuario (id, nome, email, senha)
VALUES 
(1, 'Joao Paulo Aramuni', 'joao@pucminas.br', '123'),
(2, 'Arthur Professor', 'arthurjardimfreitas@gmail.com', '123')
ON CONFLICT DO NOTHING;

INSERT INTO professor (id, cpf, departamento, instituicao_id, saldo_corrente)
VALUES
(1, '12345678901', 'Engenharia de Software', 1, 1000),
(2, '98765432100', 'Engenharia de Software', 1, 1000)
ON CONFLICT DO NOTHING;

sistemamoedaestudantilpmg@gmail.com
Senha@123