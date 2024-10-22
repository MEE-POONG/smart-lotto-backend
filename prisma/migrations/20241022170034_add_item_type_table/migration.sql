/*
  Warnings:

  - The primary key for the `Customer` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `email` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Customer` table. All the data in the column will be lost.
  - The primary key for the `Order` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `customerId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Order` table. All the data in the column will be lost.
  - You are about to alter the column `total_price` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - A unique constraint covering the columns `[customer_code]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `customer_code` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - The required column `customer_id` was added to the `Customer` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `customer_name` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customer_id` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order_date` to the `Order` table without a default value. This is not possible if the table is not empty.
  - The required column `order_id` was added to the `Order` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_customerId_fkey";

-- DropIndex
DROP INDEX "Customer_email_key";

-- AlterTable
ALTER TABLE "Customer" DROP CONSTRAINT "Customer_pkey",
DROP COLUMN "email",
DROP COLUMN "id",
DROP COLUMN "name",
ADD COLUMN     "bank_account_no" VARCHAR(30),
ADD COLUMN     "bank_account_type" VARCHAR(50),
ADD COLUMN     "bank_name" VARCHAR(100),
ADD COLUMN     "customer_address" VARCHAR(255),
ADD COLUMN     "customer_code" VARCHAR(10) NOT NULL,
ADD COLUMN     "customer_email" VARCHAR(100),
ADD COLUMN     "customer_id" VARCHAR(10) NOT NULL,
ADD COLUMN     "customer_lineid" VARCHAR(255),
ADD COLUMN     "customer_name" VARCHAR(100) NOT NULL,
ADD COLUMN     "customer_phone" VARCHAR(15),
ADD CONSTRAINT "Customer_pkey" PRIMARY KEY ("customer_id");

-- AlterTable
ALTER TABLE "Order" DROP CONSTRAINT "Order_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "customerId",
DROP COLUMN "id",
ADD COLUMN     "customer_id" VARCHAR(10) NOT NULL,
ADD COLUMN     "order_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "order_id" VARCHAR(10) NOT NULL,
ADD COLUMN     "order_status" VARCHAR(20) NOT NULL DEFAULT 'Pending',
ADD COLUMN     "pay_slip_image" VARCHAR(255),
ADD COLUMN     "payment_status" VARCHAR(20) NOT NULL DEFAULT 'Unpaid',
ALTER COLUMN "total_price" SET DATA TYPE DECIMAL(10,2),
ADD CONSTRAINT "Order_pkey" PRIMARY KEY ("order_id");

-- CreateTable
CREATE TABLE "ItemType" (
    "item_type_id" SERIAL NOT NULL,
    "type_name" VARCHAR(50) NOT NULL,

    CONSTRAINT "ItemType_pkey" PRIMARY KEY ("item_type_id")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "order_item_id" SERIAL NOT NULL,
    "order_id" VARCHAR(10) NOT NULL,
    "number_value" VARCHAR(10) NOT NULL,
    "item_type_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "price" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("order_item_id")
);

-- CreateTable
CREATE TABLE "QuickNote" (
    "note_id" SERIAL NOT NULL,
    "note_description" TEXT NOT NULL,
    "order_id" VARCHAR(10) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuickNote_pkey" PRIMARY KEY ("note_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ItemType_type_name_key" ON "ItemType"("type_name");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_customer_code_key" ON "Customer"("customer_code");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customer"("customer_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("order_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_item_type_id_fkey" FOREIGN KEY ("item_type_id") REFERENCES "ItemType"("item_type_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuickNote" ADD CONSTRAINT "QuickNote_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("order_id") ON DELETE RESTRICT ON UPDATE CASCADE;
