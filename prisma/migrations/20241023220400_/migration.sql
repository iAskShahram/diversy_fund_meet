-- CreateEnum
CREATE TYPE "AnnouncementType" AS ENUM ('ANNOUNCEMENTS', 'NEWS');

-- AlterTable
ALTER TABLE "Announcement" ADD COLUMN     "type" "AnnouncementType" NOT NULL DEFAULT 'ANNOUNCEMENTS';
