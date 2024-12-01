/*
  Warnings:

  - Added the required column `value` to the `CorrectAnswer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CorrectAnswer" ADD COLUMN     "value" TEXT NOT NULL;
