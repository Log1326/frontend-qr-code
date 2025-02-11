/*
  Warnings:

  - Added the required column `name` to the `Parameter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `code` to the `Recipe` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Parameter" ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Recipe" ADD COLUMN     "code" TEXT NOT NULL;
