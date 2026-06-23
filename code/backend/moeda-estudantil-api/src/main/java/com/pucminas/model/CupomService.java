package com.pucminas.model;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.qrcode.QRCodeWriter;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import jakarta.inject.Singleton;

import java.io.ByteArrayOutputStream;
import java.text.Normalizer;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Base64;
import java.util.EnumMap;
import java.util.Map;
import java.util.UUID;

@Singleton
public class CupomService {

    public String gerarCodigoCupom(Aluno aluno, Vantagem vantagem) {
        String alunoParte = normalizar(aluno.getNome());
        String vantagemParte = normalizar(vantagem.getNome());

        String data = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        String uuidCurto = UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        return "CUPOM-" + alunoParte + "-" + vantagemParte + "-" + data + "-" + uuidCurto;
    }

    public byte[] gerarQrCodePng(String conteudo) {
        try {
            QRCodeWriter qrCodeWriter = new QRCodeWriter();

            Map<EncodeHintType, Object> hints = new EnumMap<>(EncodeHintType.class);
            hints.put(EncodeHintType.CHARACTER_SET, "UTF-8");
            hints.put(EncodeHintType.MARGIN, 2);

            BitMatrix bitMatrix = qrCodeWriter.encode(
                    conteudo,
                    BarcodeFormat.QR_CODE,
                    300,
                    300,
                    hints
            );

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", outputStream);

            return outputStream.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Erro ao gerar QR Code do cupom.", e);
        }
    }

    public String gerarQrCodeBase64(String conteudo) {
        byte[] qrCode = gerarQrCodePng(conteudo);
        return Base64.getEncoder().encodeToString(qrCode);
    }

    private String normalizar(String texto) {
        if (texto == null || texto.isBlank()) {
            return "ITEM";
        }

        String semAcento = Normalizer.normalize(texto, Normalizer.Form.NFD)
                .replaceAll("[\\p{InCombiningDiacriticalMarks}]", "");

        String somenteTexto = semAcento
                .replaceAll("[^a-zA-Z0-9]", "")
                .toUpperCase();

        if (somenteTexto.length() > 12) {
            return somenteTexto.substring(0, 12);
        }

        if (somenteTexto.isBlank()) {
            return "ITEM";
        }

        return somenteTexto;
    }
}