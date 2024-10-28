import { Module } from '@nestjs/common';
import { QuickNoteService } from './quick-note.service';
import { QuickNoteController } from './quick-note.controller';
import { PrismaService } from '../prisma/prisma.service'; // Import PrismaService for database interactions

@Module({
  controllers: [QuickNoteController],
  providers: [QuickNoteService, PrismaService],
})
export class QuickNoteModule {}
