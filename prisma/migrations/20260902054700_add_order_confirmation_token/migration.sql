-- AlterTable
ALTER TABLE "Order" ADD COLUMN "confirmationToken" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Order_confirmationToken_key" ON "Order"("confirmationToken");
