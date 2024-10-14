/*
  Warnings:

  - The `rsvp` column on the `Rsvp` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "RsvpStatus" AS ENUM ('YES', 'NO');

-- AlterTable
ALTER TABLE "Rsvp" DROP COLUMN "rsvp",
ADD COLUMN     "rsvp" "RsvpStatus" NOT NULL DEFAULT 'NO';
