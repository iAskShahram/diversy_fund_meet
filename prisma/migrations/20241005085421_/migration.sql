/*
  Warnings:

  - You are about to drop the column `content` on the `Announcement` table. All the data in the column will be lost.
  - You are about to drop the column `affiliate_link` on the `User` table. All the data in the column will be lost.
  - Added the required column `createdById` to the `Announcement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `Announcement` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Announcement" DROP COLUMN "content",
ADD COLUMN     "createdById" TEXT NOT NULL,
ADD COLUMN     "url" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "affiliate_link",
ADD COLUMN     "affiliateLink" TEXT NOT NULL DEFAULT '';

-- AddForeignKey
ALTER TABLE "Announcement" ADD CONSTRAINT "Announcement_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
