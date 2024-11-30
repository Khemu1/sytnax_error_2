/*
  Warnings:

  - You are about to drop the column `answer` on the `CorrectAnswer` table. All the data in the column will be lost.
  - Added the required column `answerId` to the `CorrectAnswer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CorrectAnswer" DROP COLUMN "answer",
ADD COLUMN     "answerId" TEXT NOT NULL;
