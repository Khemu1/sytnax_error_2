/*
  Warnings:

  - You are about to drop the column `openInterval` on the `Survey` table. All the data in the column will be lost.
  - You are about to drop the column `workspaceId` on the `SurveySubmission` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "GradesVisibility" AS ENUM ('hidden', 'visible', 'visibleAfterSurveyCloses');

-- DropIndex
DROP INDEX "SurveySubmission_workspaceId_key";

-- AlterTable
ALTER TABLE "Survey" DROP COLUMN "openInterval",
ADD COLUMN     "GradesVisibility" "GradesVisibility" NOT NULL DEFAULT 'hidden',
ADD COLUMN     "duration" INTEGER NOT NULL DEFAULT 5,
ADD COLUMN     "endTime" TIMESTAMP(3),
ADD COLUMN     "questionsPerPage" INTEGER NOT NULL DEFAULT 5,
ADD COLUMN     "startTime" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "SurveySubmission" DROP COLUMN "workspaceId";
