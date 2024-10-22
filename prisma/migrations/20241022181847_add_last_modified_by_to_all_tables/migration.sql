-- AlterTable
ALTER TABLE "ChangeLog" ADD COLUMN     "last_modified_by" VARCHAR(36);

-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "last_modified_by" VARCHAR(36);

-- AlterTable
ALTER TABLE "ItemType" ADD COLUMN     "last_modified_by" VARCHAR(36);

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "last_modified_by" VARCHAR(36);

-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "last_modified_by" VARCHAR(36);

-- AlterTable
ALTER TABLE "QuickNote" ADD COLUMN     "last_modified_by" VARCHAR(36);

-- CreateTable
CREATE TABLE "User" (
    "user_id" VARCHAR(36) NOT NULL,
    "user_name" VARCHAR(100) NOT NULL,
    "user_email" VARCHAR(100) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_user_email_key" ON "User"("user_email");

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_last_modified_by_fkey" FOREIGN KEY ("last_modified_by") REFERENCES "User"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_last_modified_by_fkey" FOREIGN KEY ("last_modified_by") REFERENCES "User"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_last_modified_by_fkey" FOREIGN KEY ("last_modified_by") REFERENCES "User"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemType" ADD CONSTRAINT "ItemType_last_modified_by_fkey" FOREIGN KEY ("last_modified_by") REFERENCES "User"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuickNote" ADD CONSTRAINT "QuickNote_last_modified_by_fkey" FOREIGN KEY ("last_modified_by") REFERENCES "User"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChangeLog" ADD CONSTRAINT "ChangeLog_last_modified_by_fkey" FOREIGN KEY ("last_modified_by") REFERENCES "User"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
