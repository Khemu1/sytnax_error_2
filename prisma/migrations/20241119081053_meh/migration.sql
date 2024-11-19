/*
  Warnings:

  - You are about to drop the column `ownerId` on the `UserGroup` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[groupId,userId]` on the table `UserGroup` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `UserGroup` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserGroup" DROP CONSTRAINT "UserGroup_ownerId_fkey";

-- DropIndex
DROP INDEX "UserGroup_groupId_ownerId_key";

-- AlterTable
ALTER TABLE "UserGroup" DROP COLUMN "ownerId",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UserGroup_groupId_userId_key" ON "UserGroup"("groupId", "userId");

-- AddForeignKey
ALTER TABLE "UserGroup" ADD CONSTRAINT "UserGroup_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
