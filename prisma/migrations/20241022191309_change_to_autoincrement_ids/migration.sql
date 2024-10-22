/*
  Warnings:

  - The `user_id` column on the `ChangeLog` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `last_modified_by` column on the `ChangeLog` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `last_modified_by` column on the `Customer` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Enterprise` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `enterprise_id` column on the `Enterprise` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `last_modified_by` column on the `ItemType` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Order` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `order_id` column on the `Order` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `last_modified_by` column on the `Order` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `last_modified_by` column on the `OrderItem` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `last_modified_by` column on the `QuickNote` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `user_id` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `enterprise_id` on the `ChangeLog` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `enterprise_id` on the `Customer` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `enterprise_id` on the `ItemType` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `enterprise_id` on the `Order` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `order_id` on the `OrderItem` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `enterprise_id` on the `OrderItem` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `order_id` on the `QuickNote` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `enterprise_id` on the `QuickNote` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "ChangeLog" DROP CONSTRAINT "ChangeLog_enterprise_id_fkey";

-- DropForeignKey
ALTER TABLE "ChangeLog" DROP CONSTRAINT "ChangeLog_last_modified_by_fkey";

-- DropForeignKey
ALTER TABLE "Customer" DROP CONSTRAINT "Customer_enterprise_id_fkey";

-- DropForeignKey
ALTER TABLE "Customer" DROP CONSTRAINT "Customer_last_modified_by_fkey";

-- DropForeignKey
ALTER TABLE "ItemType" DROP CONSTRAINT "ItemType_enterprise_id_fkey";

-- DropForeignKey
ALTER TABLE "ItemType" DROP CONSTRAINT "ItemType_last_modified_by_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_enterprise_id_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_last_modified_by_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_enterprise_id_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_last_modified_by_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_order_id_fkey";

-- DropForeignKey
ALTER TABLE "QuickNote" DROP CONSTRAINT "QuickNote_enterprise_id_fkey";

-- DropForeignKey
ALTER TABLE "QuickNote" DROP CONSTRAINT "QuickNote_last_modified_by_fkey";

-- DropForeignKey
ALTER TABLE "QuickNote" DROP CONSTRAINT "QuickNote_order_id_fkey";

-- AlterTable
ALTER TABLE "ChangeLog" DROP COLUMN "user_id",
ADD COLUMN     "user_id" INTEGER,
DROP COLUMN "enterprise_id",
ADD COLUMN     "enterprise_id" INTEGER NOT NULL,
DROP COLUMN "last_modified_by",
ADD COLUMN     "last_modified_by" INTEGER;

-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "enterprise_id",
ADD COLUMN     "enterprise_id" INTEGER NOT NULL,
DROP COLUMN "last_modified_by",
ADD COLUMN     "last_modified_by" INTEGER;

-- AlterTable
ALTER TABLE "Enterprise" DROP CONSTRAINT "Enterprise_pkey",
DROP COLUMN "enterprise_id",
ADD COLUMN     "enterprise_id" SERIAL NOT NULL,
ADD CONSTRAINT "Enterprise_pkey" PRIMARY KEY ("enterprise_id");

-- AlterTable
ALTER TABLE "ItemType" DROP COLUMN "enterprise_id",
ADD COLUMN     "enterprise_id" INTEGER NOT NULL,
DROP COLUMN "last_modified_by",
ADD COLUMN     "last_modified_by" INTEGER;

-- AlterTable
ALTER TABLE "Order" DROP CONSTRAINT "Order_pkey",
DROP COLUMN "order_id",
ADD COLUMN     "order_id" SERIAL NOT NULL,
DROP COLUMN "enterprise_id",
ADD COLUMN     "enterprise_id" INTEGER NOT NULL,
DROP COLUMN "last_modified_by",
ADD COLUMN     "last_modified_by" INTEGER,
ADD CONSTRAINT "Order_pkey" PRIMARY KEY ("order_id");

-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "order_id",
ADD COLUMN     "order_id" INTEGER NOT NULL,
DROP COLUMN "enterprise_id",
ADD COLUMN     "enterprise_id" INTEGER NOT NULL,
DROP COLUMN "last_modified_by",
ADD COLUMN     "last_modified_by" INTEGER;

-- AlterTable
ALTER TABLE "QuickNote" DROP COLUMN "order_id",
ADD COLUMN     "order_id" INTEGER NOT NULL,
DROP COLUMN "enterprise_id",
ADD COLUMN     "enterprise_id" INTEGER NOT NULL,
DROP COLUMN "last_modified_by",
ADD COLUMN     "last_modified_by" INTEGER;

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "user_id",
ADD COLUMN     "user_id" SERIAL NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("user_id");

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_enterprise_id_fkey" FOREIGN KEY ("enterprise_id") REFERENCES "Enterprise"("enterprise_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_last_modified_by_fkey" FOREIGN KEY ("last_modified_by") REFERENCES "User"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_enterprise_id_fkey" FOREIGN KEY ("enterprise_id") REFERENCES "Enterprise"("enterprise_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_last_modified_by_fkey" FOREIGN KEY ("last_modified_by") REFERENCES "User"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("order_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_enterprise_id_fkey" FOREIGN KEY ("enterprise_id") REFERENCES "Enterprise"("enterprise_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_last_modified_by_fkey" FOREIGN KEY ("last_modified_by") REFERENCES "User"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemType" ADD CONSTRAINT "ItemType_enterprise_id_fkey" FOREIGN KEY ("enterprise_id") REFERENCES "Enterprise"("enterprise_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemType" ADD CONSTRAINT "ItemType_last_modified_by_fkey" FOREIGN KEY ("last_modified_by") REFERENCES "User"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuickNote" ADD CONSTRAINT "QuickNote_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("order_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuickNote" ADD CONSTRAINT "QuickNote_enterprise_id_fkey" FOREIGN KEY ("enterprise_id") REFERENCES "Enterprise"("enterprise_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuickNote" ADD CONSTRAINT "QuickNote_last_modified_by_fkey" FOREIGN KEY ("last_modified_by") REFERENCES "User"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChangeLog" ADD CONSTRAINT "ChangeLog_enterprise_id_fkey" FOREIGN KEY ("enterprise_id") REFERENCES "Enterprise"("enterprise_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChangeLog" ADD CONSTRAINT "ChangeLog_last_modified_by_fkey" FOREIGN KEY ("last_modified_by") REFERENCES "User"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
