-- Cadastro da Instituição
INSERT INTO instituicao (id, nome) VALUES (1, 'PUC Minas') ON CONFLICT DO NOTHING;

-- Cadastro do Professor (O ID do usuário deve coincidir na herança)
INSERT INTO usuario (id, nome, email, senha) VALUES (1, 'Joao Paulo Aramuni', 'joao@pucminas.br', '123') ON CONFLICT DO NOTHING;
INSERT INTO professor (usuario_id, cpf, departamento, instituicao_id, saldo_corrente) VALUES (1, '12345678901', 'Engenharia de Software', 1, 1000) ON CONFLICT DO NOTHING;