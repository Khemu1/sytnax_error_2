/*
  Warnings:

  - A unique constraint covering the columns `[submissionId]` on the table `SurveyParticipant` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "SurveySubmission" DROP CONSTRAINT "SurveySubmission_participantId_fkey";

-- DropIndex
DROP INDEX "SurveySubmission_participantId_key";

-- CreateIndex
CREATE UNIQUE INDEX "SurveyParticipant_submissionId_key" ON "SurveyParticipant"("submissionId");

-- AddForeignKey
ALTER TABLE "SurveyParticipant" ADD CONSTRAINT "SurveyParticipant_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "SurveySubmission"("id") ON DELETE SET NULL ON UPDATE CASCADE;
