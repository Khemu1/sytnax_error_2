/*
  Warnings:

  - You are about to drop the column `submissionId` on the `SurveyParticipant` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "SurveyParticipant" DROP CONSTRAINT "SurveyParticipant_submissionId_fkey";

-- DropIndex
DROP INDEX "SurveyParticipant_submissionId_key";

-- AlterTable
ALTER TABLE "SurveyParticipant" DROP COLUMN "submissionId";

-- AddForeignKey
ALTER TABLE "SurveySubmission" ADD CONSTRAINT "SurveySubmission_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "SurveyParticipant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
