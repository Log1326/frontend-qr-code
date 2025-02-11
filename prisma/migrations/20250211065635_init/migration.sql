/*
  Warnings:

  - You are about to drop the column `instructions` on the `Recipe` table. All the data in the column will be lost.
  - You are about to drop the column `parameters` on the `Recipe` table. All the data in the column will be lost.
  - You are about to drop the column `time` on the `Recipe` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "FieldType" AS ENUM ('TEXT', 'AREA', 'FILE');

-- AlterTable
ALTER TABLE "Recipe" DROP COLUMN "instructions",
DROP COLUMN "parameters",
DROP COLUMN "time";

-- CreateTable
CREATE TABLE "Parameter" (
    "id" TEXT NOT NULL,
    "type" "FieldType" NOT NULL,
    "value" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "Parameter_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Parameter" ADD CONSTRAINT "Parameter_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;
