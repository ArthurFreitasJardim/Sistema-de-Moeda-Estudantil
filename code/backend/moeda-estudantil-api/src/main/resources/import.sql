-- Cadastro da Instituição
INSERT INTO instituicao (id, nome)
VALUES (1, 'PUC Minas')
ON CONFLICT DO NOTHING;

-- Cadastro do Professor
-- Como Professor herda de Usuario, primeiro cria o registro na tabela usuario
INSERT INTO usuario (id, nome, email, senha)
VALUES (1, 'Joao Paulo Aramuni', 'joao@pucminas.br', '123')
ON CONFLICT DO NOTHING;

-- Depois cria o registro correspondente na tabela professor
INSERT INTO professor (id, cpf, departamento, instituicao_id, saldo_corrente)
VALUES (1, '12345678901', 'Engenharia de Software', 1, 1000)
ON CONFLICT DO NOTHING;