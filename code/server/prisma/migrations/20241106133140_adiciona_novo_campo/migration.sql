/*
  Warnings:

  - You are about to drop the column `login` on the `empresa` table. All the data in the column will be lost.
  - You are about to drop the column `nome` on the `empresa` table. All the data in the column will be lost.
  - You are about to drop the column `senha` on the `empresa` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Empresa_login_key` ON `empresa`;

-- AlterTable
ALTER TABLE `empresa` DROP COLUMN `login`,
    DROP COLUMN `nome`,
    DROP COLUMN `senha`;
