-- AlterTable
ALTER TABLE `transacao` MODIFY `tipo` ENUM('TROCA', 'ENVIO', 'RECARGA') NOT NULL;
