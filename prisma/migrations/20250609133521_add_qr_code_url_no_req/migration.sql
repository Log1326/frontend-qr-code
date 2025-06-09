-- AlterTable
ALTER TABLE "Recipe" ALTER COLUMN "clientName" SET DEFAULT 'Unknown',
ALTER COLUMN "qrCodeUrl" DROP NOT NULL;
