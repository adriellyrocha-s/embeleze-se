-- CreateEnum
CREATE TYPE "PartnerStatus" AS ENUM ('ANALISANDO', 'APTO', 'REPROVADO');

-- AlterTable
ALTER TABLE "Professional"
ADD COLUMN "status" "PartnerStatus" NOT NULL DEFAULT 'ANALISANDO';
