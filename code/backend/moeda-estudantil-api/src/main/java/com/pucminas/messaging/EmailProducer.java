package com.pucminas.messaging;

import io.micronaut.rabbitmq.annotation.Binding;
import io.micronaut.rabbitmq.annotation.RabbitClient;

@RabbitClient("moedas.exchange")
public interface EmailProducer {

    @Binding("moedas.email")
    void publicarEnvioMoedas(EnvioMoedasEvent evento);

    @Binding("moedas.cupom.email")
    void publicarCupomResgatado(CupomResgatadoEvent evento);
}