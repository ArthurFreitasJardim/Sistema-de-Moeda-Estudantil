package com.pucminas.messaging;

import com.pucminas.model.Aluno;
import com.pucminas.model.CupomService;
import com.pucminas.model.Empresa;
import com.pucminas.model.Professor;
import com.pucminas.model.ResgateVantagem;
import com.pucminas.model.Transacao;
import com.pucminas.model.Vantagem;
import com.pucminas.repository.AlunoRepository;
import com.pucminas.repository.ProfessorRepository;
import com.pucminas.repository.ResgateVantagemRepository;
import com.pucminas.repository.TransacaoRepository;
import io.micronaut.context.annotation.Value;
import io.micronaut.rabbitmq.annotation.Queue;
import io.micronaut.rabbitmq.annotation.RabbitListener;
import jakarta.activation.DataHandler;
import jakarta.inject.Singleton;
import jakarta.mail.Authenticator;
import jakarta.mail.Message;
import jakarta.mail.PasswordAuthentication;
import jakarta.mail.Session;
import jakarta.mail.Transport;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeBodyPart;
import jakarta.mail.internet.MimeMessage;
import jakarta.mail.internet.MimeMultipart;
import jakarta.mail.util.ByteArrayDataSource;

import java.nio.charset.StandardCharsets;
import java.time.format.DateTimeFormatter;
import java.util.Optional;
import java.util.Properties;

@Singleton
@RabbitListener
public class EmailConsumer {

    private final TransacaoRepository transacaoRepository;
    private final ProfessorRepository professorRepository;
    private final AlunoRepository alunoRepository;
    private final ResgateVantagemRepository resgateVantagemRepository;
    private final CupomService cupomService;

    private final String host;
    private final String port;
    private final String username;
    private final String password;
    private final String auth;
    private final String starttls;
    private final String from;

    public EmailConsumer(
            TransacaoRepository transacaoRepository,
            ProfessorRepository professorRepository,
            AlunoRepository alunoRepository,
            ResgateVantagemRepository resgateVantagemRepository,
            CupomService cupomService,
            @Value("${mail.smtp.host}") String host,
            @Value("${mail.smtp.port}") String port,
            @Value("${mail.smtp.username}") String username,
            @Value("${mail.smtp.password}") String password,
            @Value("${mail.smtp.auth}") String auth,
            @Value("${mail.smtp.starttls.enable}") String starttls,
            @Value("${mail.from}") String from
    ) {
        this.transacaoRepository = transacaoRepository;
        this.professorRepository = professorRepository;
        this.alunoRepository = alunoRepository;
        this.resgateVantagemRepository = resgateVantagemRepository;
        this.cupomService = cupomService;
        this.host = host;
        this.port = port;
        this.username = username;
        this.password = password;
        this.auth = auth;
        this.starttls = starttls;
        this.from = from;
    }

    @Queue("moedas.email")
    public void consumirEnvioMoedas(EnvioMoedasEvent evento) {
        try {
            System.out.println("Evento de envio de moedas recebido: " + evento);

            Transacao transacao = buscarTransacaoComTentativas(evento.transacaoId());
            if (transacao == null) {
                System.out.println("Transacao nao encontrada apos tentativas. ID: " + evento.transacaoId());
                return;
            }

            Optional<Professor> professorOpt = professorRepository.findById(evento.professorId());
            Optional<Aluno> alunoOpt = alunoRepository.findById(evento.alunoId());

            if (professorOpt.isEmpty() || alunoOpt.isEmpty()) {
                System.out.println("Nao foi possivel enviar e-mails. Professor ou aluno nao encontrado.");
                return;
            }

            Professor professor = professorOpt.get();
            Aluno aluno = alunoOpt.get();

            enviarConfirmacaoEnvioParaProfessor(professor, aluno, transacao);
            enviarConfirmacaoRecebimentoParaAluno(professor, aluno, transacao);

            System.out.println("E-mails de envio de moedas enviados com sucesso.");
        } catch (Exception e) {
            System.out.println("Erro ao processar evento de envio de moedas: " + e.getMessage());
            e.printStackTrace();
        }
    }

    @Queue("moedas.cupom.email")
    public void consumirCupomResgatado(CupomResgatadoEvent evento) {
        try {
            System.out.println("Evento de cupom resgatado recebido: " + evento);

            ResgateVantagem resgate = buscarResgateComTentativas(evento.resgateId());
            if (resgate == null) {
                System.out.println("Resgate nao encontrado apos tentativas. ID: " + evento.resgateId());
                return;
            }

            Aluno aluno = resgate.getAluno();
            Vantagem vantagem = resgate.getVantagem();
            Empresa empresa = vantagem.getEmpresa();

            if (aluno == null || vantagem == null || empresa == null) {
                System.out.println("Nao foi possivel enviar cupom. Dados do resgate incompletos.");
                return;
            }

            enviarCupomResgateParaAluno(aluno, vantagem, empresa, resgate);

            System.out.println("E-mail com QR Code do cupom enviado com sucesso.");
        } catch (Exception e) {
            System.out.println("Erro ao processar evento de cupom resgatado: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private Transacao buscarTransacaoComTentativas(Long transacaoId) {
        for (int tentativa = 1; tentativa <= 5; tentativa++) {
            Optional<Transacao> transacaoOpt = transacaoRepository.findById(transacaoId);

            if (transacaoOpt.isPresent()) {
                return transacaoOpt.get();
            }

            aguardarAntesDeNovaTentativa(tentativa);
        }

        return null;
    }

    private ResgateVantagem buscarResgateComTentativas(Long resgateId) {
        for (int tentativa = 1; tentativa <= 5; tentativa++) {
            Optional<ResgateVantagem> resgateOpt = resgateVantagemRepository.findById(resgateId);

            if (resgateOpt.isPresent()) {
                return resgateOpt.get();
            }

            aguardarAntesDeNovaTentativa(tentativa);
        }

        return null;
    }

    private void aguardarAntesDeNovaTentativa(int tentativa) {
        try {
            System.out.println("Aguardando banco confirmar dados. Tentativa " + tentativa + " de 5.");
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }

    private void enviarConfirmacaoEnvioParaProfessor(Professor professor, Aluno aluno, Transacao transacao) {
        if (professor.getEmail() == null || professor.getEmail().isBlank()) {
            System.out.println("Professor sem e-mail cadastrado. E-mail nao enviado.");
            return;
        }

        String assunto = "Confirmacao de envio de moedas";

        String dataFormatada = transacao.getDataHora() != null
                ? transacao.getDataHora().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"))
                : "Data nao informada";

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
                            <p>Confirmacao de envio de moedas</p>
                        </div>

                        <div class="content">
                            <p class="hello">Ola, Professor <strong>%s</strong>.</p>

                            <p class="info">
                                Confirmamos que o envio de moedas foi realizado com sucesso.
                            </p>

                            <div class="card">
                                <div class="label">Quantidade enviada</div>
                                <p class="amount">%d moedas</p>

                                <p class="info">
                                    <strong>Aluno destinatario:</strong> %s
                                </p>

                                <p class="info">
                                    <strong>Data da transacao:</strong> %s
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
                            Esta e uma mensagem automatica do Sistema de Moeda Estudantil.
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

    private void enviarConfirmacaoRecebimentoParaAluno(Professor professor, Aluno aluno, Transacao transacao) {
        if (aluno.getEmail() == null || aluno.getEmail().isBlank()) {
            System.out.println("Aluno sem e-mail cadastrado. E-mail nao enviado.");
            return;
        }

        String assunto = "Voce recebeu moedas!";

        String dataFormatada = transacao.getDataHora() != null
                ? transacao.getDataHora().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"))
                : "Data nao informada";

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
                            <h1>Voce recebeu moedas!</h1>
                            <p>Sistema de Moeda Estudantil</p>
                        </div>

                        <div class="content">
                            <p class="hello">Ola, <strong>%s</strong>.</p>

                            <p class="info">
                                Voce recebeu uma nova recompensa academica.
                            </p>

                            <div class="card">
                                <div class="label">Quantidade recebida</div>
                                <p class="amount">+%d moedas</p>

                                <p class="info">
                                    <strong>Professor:</strong> %s
                                </p>

                                <p class="info">
                                    <strong>Data da transacao:</strong> %s
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
                            Esta e uma mensagem automatica do Sistema de Moeda Estudantil.
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

    private void enviarCupomResgateParaAluno(
            Aluno aluno,
            Vantagem vantagem,
            Empresa empresa,
            ResgateVantagem resgate
    ) {
        if (aluno.getEmail() == null || aluno.getEmail().isBlank()) {
            System.out.println("Aluno sem e-mail cadastrado. Cupom nao enviado.");
            return;
        }

        String assunto = "Cupom de resgate - " + vantagem.getNome();

        String conteudoQrCode = gerarTextoDoQrCode(aluno, vantagem, empresa, resgate);
        byte[] qrCodeBytes = cupomService.gerarQrCodePng(conteudoQrCode);

        String descricao = vantagem.getDescricao() != null && !vantagem.getDescricao().isBlank()
                ? vantagem.getDescricao()
                : "Descricao nao informada";

        String corpoHtml = """
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
                            background: linear-gradient(135deg, #111827, #10b981);
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
                        .codigo {
                            font-size: 17px;
                            font-weight: 900;
                            color: #111827;
                            word-break: break-all;
                            background-color: #ffffff;
                            border-left: 4px solid #10b981;
                            padding: 14px 16px;
                            border-radius: 10px;
                        }
                        .qr {
                            text-align: center;
                            margin: 24px 0;
                        }
                        .qr img {
                            width: 220px;
                            height: 220px;
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
                            <h1>Cupom de Resgate</h1>
                            <p>Sistema de Moeda Estudantil</p>
                        </div>

                        <div class="content">
                            <p class="hello">Ola, <strong>%s</strong>.</p>

                            <p class="info">
                                Seu resgate foi realizado com sucesso. Apresente este cupom para utilizar sua vantagem.
                            </p>

                            <div class="card">
                                <div class="label">Vantagem</div>
                                <p class="info"><strong>%s</strong></p>

                                <div class="label">Descricao</div>
                                <p class="info">%s</p>

                                <div class="label">Empresa</div>
                                <p class="info">%s</p>

                                <div class="label">Valor</div>
                                <p class="info"><strong>%d moedas</strong></p>

                                <div class="label">Codigo do cupom</div>
                                <div class="codigo">%s</div>
                            </div>

                            <div class="qr">
                                <p><strong>QR Code do cupom</strong></p>
                                <img src="cid:qrcodecupom" alt="QR Code do Cupom" />
                            </div>

                            <p class="info">
                                Ao escanear o QR Code, serao exibidas as informacoes principais do cupom.
                            </p>
                        </div>

                        <div class="footer">
                            Esta e uma mensagem automatica do Sistema de Moeda Estudantil.
                        </div>
                    </div>
                </body>
                </html>
                """.formatted(
                escapeHtml(aluno.getNome()),
                escapeHtml(vantagem.getNome()),
                escapeHtml(descricao),
                escapeHtml(empresa.getNome()),
                resgate.getValorMoedas(),
                escapeHtml(resgate.getCodigoCupom())
        );

        enviarEmailHtmlComQrCode(aluno.getEmail(), assunto, corpoHtml, qrCodeBytes);
    }

    private String gerarTextoDoQrCode(
            Aluno aluno,
            Vantagem vantagem,
            Empresa empresa,
            ResgateVantagem resgate
    ) {
        return """
                Sistema de Moeda Estudantil

                Cupom de Resgate
                Codigo: %s
                Aluno: %s
                Vantagem: %s
                Empresa: %s
                Valor: %d moedas
                Data do resgate: %s

                Apresente este cupom para utilizar a vantagem.
                """.formatted(
                resgate.getCodigoCupom(),
                aluno.getNome(),
                vantagem.getNome(),
                empresa.getNome(),
                resgate.getValorMoedas(),
                resgate.getDataHora().toString()
        );
    }

    private void enviarEmailHtml(String destinatario, String assunto, String html) {
        try {
            MimeMessage message = criarMensagem(destinatario, assunto);
            message.setContent(html, "text/html; charset=UTF-8");

            Transport.send(message);

            System.out.println("E-mail enviado com sucesso para: " + destinatario);
        } catch (Exception e) {
            System.out.println("Erro ao enviar e-mail para " + destinatario + ": " + e.getMessage());
            throw new RuntimeException("Erro ao enviar e-mail HTML.", e);
        }
    }

    private void enviarEmailHtmlComQrCode(
            String destinatario,
            String assunto,
            String corpoHtml,
            byte[] qrCodeBytes
    ) {
        try {
            MimeMessage message = criarMensagem(destinatario, assunto);

            MimeMultipart multipart = new MimeMultipart("related");

            MimeBodyPart htmlPart = new MimeBodyPart();
            htmlPart.setContent(corpoHtml, "text/html; charset=UTF-8");
            multipart.addBodyPart(htmlPart);

            MimeBodyPart qrCodePart = new MimeBodyPart();
            ByteArrayDataSource dataSource = new ByteArrayDataSource(qrCodeBytes, "image/png");
            qrCodePart.setDataHandler(new DataHandler(dataSource));
            qrCodePart.setHeader("Content-ID", "<qrcodecupom>");
            qrCodePart.setDisposition(MimeBodyPart.INLINE);
            qrCodePart.setFileName("qrcode-cupom.png");
            multipart.addBodyPart(qrCodePart);

            message.setContent(multipart);

            Transport.send(message);

            System.out.println("E-mail com QR Code enviado com sucesso para: " + destinatario);
        } catch (Exception e) {
            System.out.println("Erro ao enviar e-mail com QR Code para " + destinatario + ": " + e.getMessage());
            throw new RuntimeException("Erro ao enviar e-mail HTML com QR Code.", e);
        }
    }

    private MimeMessage criarMensagem(String destinatario, String assunto) throws Exception {
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
        message.setFrom(new InternetAddress(
                from,
                "Sistema de Moeda Estudantil",
                StandardCharsets.UTF_8.name()
        ));
        message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(destinatario));
        message.setSubject(assunto, StandardCharsets.UTF_8.name());

        return message;
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