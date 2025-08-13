/*
  Warnings:

  - Added the required column `lemonSqueezyVariantId` to the `ProductVariant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."ProductVariant" ADD COLUMN     "lemonSqueezyVariantId" TEXT NOT NULL;
