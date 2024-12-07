/*
  Warnings:

  - Added the required column `email` to the `SurveySubmission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `SurveySubmission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `studentId` to the `SurveySubmission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SurveySubmission" ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "phoneNumber" TEXT NOT NULL,
ADD COLUMN     "studentId" TEXT NOT NULL;
