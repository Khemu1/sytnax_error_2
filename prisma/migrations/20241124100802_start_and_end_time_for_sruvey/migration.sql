/*
  Warnings:

  - You are about to drop the column `GradesVisibility` on the `Survey` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Question" ALTER COLUMN "points" SET DEFAULT 1;

-- AlterTable
ALTER TABLE "Survey" DROP COLUMN "GradesVisibility",
ADD COLUMN     "gradesVisibility" "GradesVisibility" NOT NULL DEFAULT 'hidden',
ALTER COLUMN "endTime" SET DATA TYPE TEXT,
ALTER COLUMN "startTime" SET DATA TYPE TEXT;
