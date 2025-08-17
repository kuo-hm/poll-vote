/*
  Warnings:

  - You are about to drop the column `question` on the `Poll` table. All the data in the column will be lost.
  - Added the required column `title` to the `Poll` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Poll" DROP COLUMN "question",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "title" TEXT NOT NULL;
