/*
  Warnings:

  - You are about to drop the column `value` on the `Parameter` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Recipe` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "RecipeStatus" AS ENUM ('NEW', 'IN_PROGRESS', 'COMPLETED');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('CREATED', 'VIEWED', 'STATUS_CHANGE', 'UPDATED');

-- AlterTable
ALTER TABLE "Parameter" DROP COLUMN "value",
ADD COLUMN     "description" TEXT NOT NULL DEFAULT 'Описание по умолчанию';

-- AlterTable
ALTER TABLE "Recipe" DROP COLUMN "title",
ADD COLUMN     "clientName" TEXT NOT NULL DEFAULT 'Неизвестный клиент',
ADD COLUMN     "employee" TEXT NOT NULL DEFAULT 'АНТОША',
ADD COLUMN     "price" DOUBLE PRECISION,
ADD COLUMN     "status" "RecipeStatus" NOT NULL DEFAULT 'NEW';

-- CreateTable
CREATE TABLE "RecipeEvent" (
    "id" TEXT NOT NULL,
    "type" "EventType" NOT NULL,
    "recipeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RecipeEvent_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RecipeEvent" ADD CONSTRAINT "RecipeEvent_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;
