package com.pucminas.service;

import com.pucminas.model.Aluno;
import com.pucminas.model.Professor;
import com.pucminas.model.Transacao;
import io.micronaut.context.annotation.Value;
import jakarta.inject.Singleton;
import jakarta.mail.Authenticator;
import jakarta.mail.Message;
import jakarta.mail.PasswordAuthentication;
import jakarta.mail.Session;
import jakarta.mail.Transport;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;

import java.nio.charset.StandardCharsets;
import java.time.format.DateTimeFormatter;
import java.util.Properties;

@Singleton
public class EmailService {

    @Value("${mail.smtp.host}")
    private String host;

    @Value("${mail.smtp.port}")
    private String port;

    @Value("${mail.smtp.username}")
    private String username;

    @Value("${mail.smtp.password}")
    private String password;

    @Value("${mail.smtp.auth}")
    private String auth;

    @Value("${mail.smtp.starttls.enable}")
    private String starttls;

    @Value("${mail.from}")
    private String from;

    public void enviarConfirmacaoEnvioParaProfessor(Professor professor, Aluno aluno, Transacao transacao) {
        if (professor.getEmail() == null || professor.getEmail().isBlank()) {
            System.out.println("Professor sem e-mail cadastrado. E-mail não enviado.");
            return;
        }

        String assunto = "Confirmação de envio de moedas";

        String dataFormatada = transacao.getDataHora() != null
                ? transacao.getDataHora().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"))
                : "Data não informada";

        String html = """
                <!DOCTYPE html>
                <html lang="pt-BR">
                <head>
                    <meta charset="UTF-8">
                    <style>
                        body {
                            margin: 0;
                            padding: 0;
                            background-color: #f1f5f9;
                            font-family: Arial, Helvetica, sans-serif;
                            color: #1e293b;
                        }
                        .container {
                            max-width: 620px;
                            margin: 32px auto;
                            background-color: #ffffff;
                            border-radius: 18px;
                            overflow: hidden;
                            box-shadow: 0 10px 30px rgba(15, 23, 42, 0.12);
                        }
                        .header {
                            background: linear-gradient(135deg, #2563eb, #10b981);
                            padding: 32px 28px;
                            color: #ffffff;
                            text-align: center;
                        }
                        .header h1 {
                            margin: 0;
                            font-size: 26px;
                            font-weight: 800;
                        }
                        .header p {
                            margin: 8px 0 0;
                            font-size: 14px;
                            opacity: 0.95;
                        }
                        .content {
                            padding: 32px 28px;
                        }
                        .hello {
                            font-size: 18px;
                            margin-bottom: 18px;
                        }
                        .card {
                            background-color: #f8fafc;
                            border: 1px solid #e2e8f0;
                            border-radius: 16px;
                            padding: 22px;
                            margin: 24px 0;
                        }
                        .amount {
                            font-size: 36px;
                            font-weight: 900;
                            color: #2563eb;
                            margin: 0;
                        }
                        .label {
                            font-size: 12px;
                            text-transform: uppercase;
                            letter-spacing: 1px;
                            color: #64748b;
                            font-weight: 700;
                            margin-bottom: 6px;
                        }
                        .info {
                            margin: 14px 0;
                            font-size: 15px;
                            line-height: 1.5;
                        }
                        .reason {
                            background-color: #ffffff;
                            border-left: 4px solid #2563eb;
                            padding: 14px 16px;
                            border-radius: 10px;
                            margin-top: 10px;
                            color: #334155;
                        }
                        .footer {
                            padding: 20px 28px;
                            background-color: #f8fafc;
                            text-align: center;
                            color: #64748b;
                            font-size: 12px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Sistema de Moeda Estudantil</h1>
                            <p>Confirmação de envio de moedas</p>
                        </div>
                
                        <div class="content">
                            <p class="hello">Olá, Professor <strong>%s</strong>.</p>
                
                            <p class="info">
                                Confirmamos que o envio de moedas foi realizado com sucesso.
                            </p>
                
                            <div class="card">
                                <div class="label">Quantidade enviada</div>
                                <p class="amount">%d moedas</p>
                
                                <p class="info">
                                    <strong>Aluno destinatário:</strong> %s
                                </p>
                
                                <p class="info">
                                    <strong>Data da transação:</strong> %s
                                </p>
                
                                <div class="label">Motivo informado</div>
                                <div class="reason">
                                    %s
                                </div>
                            </div>
                
                            <p class="info">
                                O saldo do professor foi atualizado automaticamente no sistema.
                            </p>
                        </div>
                
                        <div class="footer">
                            Esta é uma mensagem automática do Sistema de Moeda Estudantil.
                        </div>
                    </div>
                </body>
                </html>
                """.formatted(
                escapeHtml(professor.getNome()),
                transacao.getValor(),
                escapeHtml(aluno.getNome()),
                dataFormatada,
                escapeHtml(transacao.getMotivo())
        );

        enviarEmailHtml(professor.getEmail(), assunto, html);
    }

    public void enviarConfirmacaoRecebimentoParaAluno(Professor professor, Aluno aluno, Transacao transacao) {
        if (aluno.getEmail() == null || aluno.getEmail().isBlank()) {
            System.out.println("Aluno sem e-mail cadastrado. E-mail não enviado.");
            return;
        }

        String assunto = "Você recebeu moedas!";

        String dataFormatada = transacao.getDataHora() != null
                ? transacao.getDataHora().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"))
                : "Data não informada";

        String html = """
                <!DOCTYPE html>
                <html lang="pt-BR">
                <head>
                    <meta charset="UTF-8">
                    <style>
                        body {
                            margin: 0;
                            padding: 0;
                            background-color: #f1f5f9;
                            font-family: Arial, Helvetica, sans-serif;
                            color: #1e293b;
                        }
                        .container {
                            max-width: 620px;
                            margin: 32px auto;
                            background-color: #ffffff;
                            border-radius: 18px;
                            overflow: hidden;
                            box-shadow: 0 10px 30px rgba(15, 23, 42, 0.12);
                        }
                        .header {
                            background: linear-gradient(135deg, #10b981, #2563eb);
                            padding: 32px 28px;
                            color: #ffffff;
                            text-align: center;
                        }
                        .header h1 {
                            margin: 0;
                            font-size: 26px;
                            font-weight: 800;
                        }
                        .header p {
                            margin: 8px 0 0;
                            font-size: 14px;
                            opacity: 0.95;
                        }
                        .content {
                            padding: 32px 28px;
                        }
                        .hello {
                            font-size: 18px;
                            margin-bottom: 18px;
                        }
                        .card {
                            background-color: #f8fafc;
                            border: 1px solid #e2e8f0;
                            border-radius: 16px;
                            padding: 22px;
                            margin: 24px 0;
                        }
                        .amount {
                            font-size: 38px;
                            font-weight: 900;
                            color: #10b981;
                            margin: 0;
                        }
                        .balance {
                            font-size: 24px;
                            font-weight: 800;
                            color: #2563eb;
                            margin: 4px 0 0;
                        }
                        .label {
                            font-size: 12px;
                            text-transform: uppercase;
                            letter-spacing: 1px;
                            color: #64748b;
                            font-weight: 700;
                            margin-bottom: 6px;
                        }
                        .info {
                            margin: 14px 0;
                            font-size: 15px;
                            line-height: 1.5;
                        }
                        .reason {
                            background-color: #ffffff;
                            border-left: 4px solid #10b981;
                            padding: 14px 16px;
                            border-radius: 10px;
                            margin-top: 10px;
                            color: #334155;
                        }
                        .footer {
                            padding: 20px 28px;
                            background-color: #f8fafc;
                            text-align: center;
                            color: #64748b;
                            font-size: 12px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Você recebeu moedas!</h1>
                            <p>Sistema de Moeda Estudantil</p>
                        </div>
                
                        <div class="content">
                            <p class="hello">Olá, <strong>%s</strong>.</p>
                
                            <p class="info">
                                Você recebeu uma nova recompensa acadêmica.
                            </p>
                
                            <div class="card">
                                <div class="label">Quantidade recebida</div>
                                <p class="amount">+%d moedas</p>
                
                                <p class="info">
                                    <strong>Professor:</strong> %s
                                </p>
                
                                <p class="info">
                                    <strong>Data da transação:</strong> %s
                                </p>
                
                                <div class="label">Motivo</div>
                                <div class="reason">
                                    %s
                                </div>
                            </div>
                
                            <div class="card">
                                <div class="label">Seu novo saldo</div>
                                <p class="balance">%d moedas</p>
                            </div>
                        </div>
                
                        <div class="footer">
                            Esta é uma mensagem automática do Sistema de Moeda Estudantil.
                        </div>
                    </div>
                </body>
                </html>
                """.formatted(
                escapeHtml(aluno.getNome()),
                transacao.getValor(),
                escapeHtml(professor.getNome()),
                dataFormatada,
                escapeHtml(transacao.getMotivo()),
                aluno.getSaldoAtual()
        );

        enviarEmailHtml(aluno.getEmail(), assunto, html);
    }

    private void enviarEmailHtml(String destinatario, String assunto, String html) {
        try {
            Properties props = new Properties();
            props.put("mail.smtp.host", host);
            props.put("mail.smtp.port", port);
            props.put("mail.smtp.auth", auth);
            props.put("mail.smtp.starttls.enable", starttls);
            props.put("mail.smtp.ssl.trust", host);

            Session session = Session.getInstance(props, new Authenticator() {
                @Override
                protected PasswordAuthentication getPasswordAuthentication() {
                    return new PasswordAuthentication(username, password);
                }
            });

            MimeMessage message = new MimeMessage(session);
            message.setFrom(new InternetAddress(from, "Sistema de Moeda Estudantil", StandardCharsets.UTF_8.name()));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(destinatario));
            message.setSubject(assunto, StandardCharsets.UTF_8.name());
            message.setContent(html, "text/html; charset=UTF-8");

            Transport.send(message);

            System.out.println("E-mail enviado com sucesso para: " + destinatario);

        } catch (Exception e) {
            System.out.println("Erro ao enviar e-mail para " + destinatario + ": " + e.getMessage());
        }
    }

    private String escapeHtml(String texto) {
        if (texto == null) {
            return "";
        }

        return texto
                .replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#39;");
    }
}