-- CreateTable
CREATE TABLE "ChangeLog" (
    "log_id" SERIAL NOT NULL,
    "entity_name" VARCHAR(50) NOT NULL,
    "action" VARCHAR(20) NOT NULL,
    "entity_id" VARCHAR(50) NOT NULL,
    "user_id" VARCHAR(50),
    "before_data" JSONB,
    "after_data" JSONB,
    "change_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "enterprise_id" VARCHAR(36) NOT NULL,

    CONSTRAINT "ChangeLog_pkey" PRIMARY KEY ("log_id")
);

-- AddForeignKey
ALTER TABLE "ChangeLog" ADD CONSTRAINT "ChangeLog_enterprise_id_fkey" FOREIGN KEY ("enterprise_id") REFERENCES "Enterprise"("enterprise_id") ON DELETE RESTRICT ON UPDATE CASCADE;
