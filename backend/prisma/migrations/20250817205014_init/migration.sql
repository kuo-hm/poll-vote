/*
  Warnings:

  - Added the required column `ttlInMs` to the `Poll` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Poll" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "ttlInMs" INTEGER NOT NULL;
