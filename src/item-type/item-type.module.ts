import { Module } from '@nestjs/common';
import { ItemTypeService } from './item-type.service';
import { ItemTypeController } from './item-type.controller';
import { PrismaService } from '../prisma/prisma.service'; // Import PrismaService for database interactions

@Module({
  controllers: [ItemTypeController],
  providers: [ItemTypeService, PrismaService],
})
export class ItemTypeModule {}
