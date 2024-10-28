import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QuickNoteDto } from './dto/quick-note.dto';
import { QuickNote } from '@prisma/client';

@Injectable()
export class QuickNoteService {
  constructor(private prisma: PrismaService) {}

  async create(data: QuickNoteDto) {
    return this.prisma.quickNote.create({ data });
  }

  async findAll(): Promise<QuickNote[]> {
    return this.prisma.quickNote.findMany();
  }

  async findOne(id: number): Promise<QuickNote> {
    if (!id || id <= 0) {
      throw new BadRequestException('Invalid note ID');
    }

    const note = await this.prisma.quickNote.findUnique({
      where: { note_id: id },
    });
    if (!note) throw new NotFoundException('Note not found');
    return note;
  }

  async update(id: number, data: QuickNoteDto): Promise<QuickNote> {
    await this.findOne(id); // Verify note exists

    try {
      return await this.prisma.quickNote.update({
        where: { note_id: id },
        data,
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to update note');
    }
  }

  async remove(id: number): Promise<QuickNote> {
    await this.findOne(id); // Verify note exists

    try {
      return await this.prisma.$transaction(async (prisma) => {
        return prisma.quickNote.delete({
          where: { note_id: id },
        });
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete note');
    }
  }
}
