/*
  Warnings:

  - Added the required column `qrCodeUrl` to the `Recipe` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Recipe" ADD COLUMN     "qrCodeUrl" TEXT NOT NULL;
