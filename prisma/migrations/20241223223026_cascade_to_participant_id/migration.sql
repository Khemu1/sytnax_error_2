-- DropForeignKey
ALTER TABLE "SurveySubmission" DROP CONSTRAINT "SurveySubmission_participantId_fkey";

-- AddForeignKey
ALTER TABLE "SurveySubmission" ADD CONSTRAINT "SurveySubmission_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "SurveyParticipant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
