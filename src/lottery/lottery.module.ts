// lottery.module.ts
import { Module } from '@nestjs/common';
import { LotteryService } from './lottery.service';
import { LotteryController } from './lottery.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [LotteryController],
  providers: [LotteryService, PrismaService],
})
export class LotteryModule {}
