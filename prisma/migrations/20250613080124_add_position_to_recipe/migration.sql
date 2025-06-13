/*
  Warnings:

  - A unique constraint covering the columns `[status,position]` on the table `Recipe` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Recipe" ADD COLUMN     "position" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "Recipe_status_position_key" ON "Recipe"("status", "position");
