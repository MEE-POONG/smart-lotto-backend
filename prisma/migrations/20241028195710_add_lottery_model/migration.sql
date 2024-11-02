-- AlterTable
ALTER TABLE "ItemType" ADD COLUMN     "lotteryLottery_id" INTEGER;

-- CreateTable
CREATE TABLE "Lottery" (
    "lottery_id" SERIAL NOT NULL,
    "lottery_name" VARCHAR(100) NOT NULL,
    "draw_date" TIMESTAMP(3) NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'Upcoming',
    "enterprise_id" INTEGER NOT NULL,
    "last_modified_by" INTEGER,
    "userUser_id" INTEGER,

    CONSTRAINT "Lottery_pkey" PRIMARY KEY ("lottery_id")
);

-- AddForeignKey
ALTER TABLE "ItemType" ADD CONSTRAINT "ItemType_lotteryLottery_id_fkey" FOREIGN KEY ("lotteryLottery_id") REFERENCES "Lottery"("lottery_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lottery" ADD CONSTRAINT "Lottery_enterprise_id_fkey" FOREIGN KEY ("enterprise_id") REFERENCES "Enterprise"("enterprise_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lottery" ADD CONSTRAINT "Lottery_last_modified_by_fkey" FOREIGN KEY ("last_modified_by") REFERENCES "User"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lottery" ADD CONSTRAINT "Lottery_userUser_id_fkey" FOREIGN KEY ("userUser_id") REFERENCES "User"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
