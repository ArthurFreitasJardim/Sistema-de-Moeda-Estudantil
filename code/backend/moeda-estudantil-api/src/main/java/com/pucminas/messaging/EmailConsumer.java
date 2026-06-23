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
            enviarConfirmacaoRecebimentoParaAluno(aluno, professor, transacao);

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
        String assunto = "Confirmacao de envio de moedas";

        String corpo = """
                Ola, %s.

                O envio de moedas foi realizado com sucesso.

                Aluno: %s
                Valor enviado: %d moedas
                Motivo: %s

                Sistema de Moeda Estudantil
                """.formatted(
                professor.getNome(),
                aluno.getNome(),
                transacao.getValor(),
                transacao.getMotivo()
        );

        enviarEmailTexto(professor.getEmail(), assunto, corpo);
    }

    private void enviarConfirmacaoRecebimentoParaAluno(Aluno aluno, Professor professor, Transacao transacao) {
        String assunto = "Voce recebeu moedas estudantis";

        String corpo = """
                Ola, %s.

                Voce recebeu moedas estudantis.

                Professor: %s
                Valor recebido: %d moedas
                Motivo: %s

                Acesse seu painel para consultar o saldo e o extrato.

                Sistema de Moeda Estudantil
                """.formatted(
                aluno.getNome(),
                professor.getNome(),
                transacao.getValor(),
                transacao.getMotivo()
        );

        enviarEmailTexto(aluno.getEmail(), assunto, corpo);
    }

    private void enviarCupomResgateParaAluno(
            Aluno aluno,
            Vantagem vantagem,
            Empresa empresa,
            ResgateVantagem resgate
    ) {
        String assunto = "Cupom de resgate - " + vantagem.getNome();

        String conteudoQrCode = gerarTextoDoQrCode(aluno, vantagem, empresa, resgate);
        byte[] qrCodeBytes = cupomService.gerarQrCodePng(conteudoQrCode);

        String corpoHtml = """
                <html>
                    <body style="font-family: Arial, sans-serif; background-color: #f6f6f6; padding: 24px;">
                        <div style="max-width: 620px; margin: auto; background: #ffffff; border-radius: 12px; padding: 24px; border: 1px solid #dddddd;">
                            <h2 style="color: #111827; margin-top: 0;">Cupom de Resgate</h2>

                            <p>Ola, <strong>%s</strong>.</p>

                            <p>Seu resgate foi realizado com sucesso. Apresente este cupom para utilizar sua vantagem.</p>

                            <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 20px 0;">
                                <p><strong>Vantagem:</strong> %s</p>
                                <p><strong>Descricao:</strong> %s</p>
                                <p><strong>Empresa:</strong> %s</p>
                                <p><strong>Valor:</strong> %d moedas</p>
                                <p><strong>Codigo do cupom:</strong></p>
                                <p style="font-size: 18px; font-weight: bold; color: #111827; word-break: break-all;">%s</p>
                            </div>

                            <p style="text-align: center;"><strong>QR Code do cupom</strong></p>

                            <div style="text-align: center; margin: 24px 0;">
                                <img src="cid:qrcodecupom" alt="QR Code do Cupom" style="width: 220px; height: 220px;" />
                            </div>

                            <p style="font-size: 13px; color: #6b7280;">
                                Ao escanear o QR Code, serao exibidas as informacoes principais do cupom.
                            </p>

                            <p style="font-size: 13px; color: #6b7280;">
                                Este cupom foi gerado automaticamente pelo Sistema de Moeda Estudantil.
                            </p>
                        </div>
                    </body>
                </html>
                """.formatted(
                aluno.getNome(),
                vantagem.getNome(),
                vantagem.getDescricao(),
                empresa.getNome(),
                resgate.getValorMoedas(),
                resgate.getCodigoCupom()
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

    private void enviarEmailTexto(String destinatario, String assunto, String corpo) {
        try {
            Message message = criarMensagem(destinatario, assunto);
            message.setText(corpo);
            Transport.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao enviar e-mail de texto.", e);
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
            htmlPart.setContent(corpoHtml, "text/html; charset=utf-8");
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
        } catch (Exception e) {
            throw new RuntimeException("Erro ao enviar e-mail HTML com QR Code.", e);
        }
    }

    private MimeMessage criarMensagem(String destinatario, String assunto) throws Exception {
        Properties props = new Properties();
        props.put("mail.smtp.host", host);
        props.put("mail.smtp.port", port);
        props.put("mail.smtp.auth", auth);
        props.put("mail.smtp.starttls.enable", starttls);

        Session session = Session.getInstance(props, new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(username, password);
            }
        });

        MimeMessage message = new MimeMessage(session);
        message.setFrom(new InternetAddress(from));
        message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(destinatario));
        message.setSubject(assunto, "UTF-8");

        return message;
    }
}