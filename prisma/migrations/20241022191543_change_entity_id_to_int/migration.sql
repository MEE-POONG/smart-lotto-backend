/*
  Warnings:

  - Changed the type of `entity_id` on the `ChangeLog` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "ChangeLog" DROP COLUMN "entity_id",
ADD COLUMN     "entity_id" INTEGER NOT NULL;
