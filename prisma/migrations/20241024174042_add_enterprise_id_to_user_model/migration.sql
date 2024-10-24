-- AlterTable
ALTER TABLE "User" ADD COLUMN     "enterprise_id" INTEGER;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_enterprise_id_fkey" FOREIGN KEY ("enterprise_id") REFERENCES "Enterprise"("enterprise_id") ON DELETE SET NULL ON UPDATE CASCADE;
