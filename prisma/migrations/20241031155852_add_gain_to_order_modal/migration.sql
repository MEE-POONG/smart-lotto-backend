/*
  Warnings:

  - You are about to drop the column `gain` on the `OrderItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "gain_price" DECIMAL(10,2);

-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "gain";
