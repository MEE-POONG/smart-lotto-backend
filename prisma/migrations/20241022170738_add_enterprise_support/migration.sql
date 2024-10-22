/*
  Warnings:

  - You are about to drop the column `customer_lineid` on the `Customer` table. All the data in the column will be lost.
  - Added the required column `enterprise_id` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `enterprise_id` to the `ItemType` table without a default value. This is not possible if the table is not empty.
  - Added the required column `enterprise_id` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `enterprise_id` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `enterprise_id` to the `QuickNote` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "customer_lineid",
ADD COLUMN     "enterprise_id" VARCHAR(36) NOT NULL;

-- AlterTable
ALTER TABLE "ItemType" ADD COLUMN     "enterprise_id" VARCHAR(36) NOT NULL;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "enterprise_id" VARCHAR(36) NOT NULL;

-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "enterprise_id" VARCHAR(36) NOT NULL;

-- AlterTable
ALTER TABLE "QuickNote" ADD COLUMN     "enterprise_id" VARCHAR(36) NOT NULL;

-- CreateTable
CREATE TABLE "Enterprise" (
    "enterprise_id" VARCHAR(36) NOT NULL,
    "enterprise_name" VARCHAR(100) NOT NULL,

    CONSTRAINT "Enterprise_pkey" PRIMARY KEY ("enterprise_id")
);

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_enterprise_id_fkey" FOREIGN KEY ("enterprise_id") REFERENCES "Enterprise"("enterprise_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_enterprise_id_fkey" FOREIGN KEY ("enterprise_id") REFERENCES "Enterprise"("enterprise_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_enterprise_id_fkey" FOREIGN KEY ("enterprise_id") REFERENCES "Enterprise"("enterprise_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemType" ADD CONSTRAINT "ItemType_enterprise_id_fkey" FOREIGN KEY ("enterprise_id") REFERENCES "Enterprise"("enterprise_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuickNote" ADD CONSTRAINT "QuickNote_enterprise_id_fkey" FOREIGN KEY ("enterprise_id") REFERENCES "Enterprise"("enterprise_id") ON DELETE RESTRICT ON UPDATE CASCADE;
