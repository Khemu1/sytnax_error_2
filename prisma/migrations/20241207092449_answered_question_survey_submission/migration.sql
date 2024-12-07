/*
  Warnings:

  - You are about to drop the column `point` on the `AnsweredQuestion` table. All the data in the column will be lost.
  - Added the required column `QuestionPoints` to the `AnsweredQuestion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `submittedAt` to the `SurveySubmission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AnsweredQuestion" DROP COLUMN "point",
ADD COLUMN     "QuestionPoints" INTEGER NOT NULL,
ADD COLUMN     "givenPoints" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "SurveySubmission" ADD COLUMN     "cleanSubmission" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "submittedAt" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "AnsweredQuestion" ADD CONSTRAINT "AnsweredQuestion_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;
