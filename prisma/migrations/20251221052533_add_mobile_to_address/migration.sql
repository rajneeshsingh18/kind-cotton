/*
  Warnings:

  - You are about to drop the column `lemonSqueezyVariantId` on the `ProductVariant` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[razorpayOrderId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[razorpayPaymentId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Address" ADD COLUMN     "mobile" TEXT;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "razorpayOrderId" TEXT,
ADD COLUMN     "razorpayPaymentId" TEXT,
ADD COLUMN     "razorpaySignature" TEXT;

-- AlterTable
ALTER TABLE "ProductVariant" DROP COLUMN "lemonSqueezyVariantId";

-- CreateIndex
CREATE UNIQUE INDEX "Order_razorpayOrderId_key" ON "Order"("razorpayOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "Order_razorpayPaymentId_key" ON "Order"("razorpayPaymentId");
