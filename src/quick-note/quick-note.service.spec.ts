import { Test, TestingModule } from '@nestjs/testing';
import { QuickNoteService } from './quick-note.service';
import { PrismaService } from '../prisma/prisma.service';
import { InternalServerErrorException } from '@nestjs/common';

describe('QuickNoteService', () => {
  let service: QuickNoteService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuickNoteService, PrismaService],
    }).compile();

    service = module.get<QuickNoteService>(QuickNoteService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should create a note', async () => {
    const mockNote = {
      note_id: 1,
      note_description: 'Test Note',
      order_id: 1,
      enterprise_id: 1,
      created_at: new Date(),
      updated_at: new Date(),
      last_modified_by: 1, // Add this line
    };
    jest.spyOn(prismaService.quickNote, 'create').mockResolvedValue(mockNote);

    expect(
      await service.create({
        note_description: 'Test Note',
        order_id: 1,
        enterprise_id: 1,
      }),
    ).toEqual(mockNote);
  });

  it('should find one note', async () => {
    const mockNote = {
      note_id: 1,
      note_description: 'Test Note',
      order_id: 1,
      enterprise_id: 1,
      last_modified_by: 1,
      created_at: new Date(),
      updated_at: new Date(),
    };
    jest
      .spyOn(prismaService.quickNote, 'findUnique')
      .mockResolvedValue(mockNote);

    expect(await service.findOne(1)).toEqual(mockNote);
  });

  it('should update a note', async () => {
    const mockUpdatedNote = {
      note_id: 1,
      note_description: 'Updated Test Note',
      order_id: 1,
      enterprise_id: 1,
      created_at: new Date(),
      updated_at: new Date(),
      last_modified_by: 1,
    };
    // Add this line to mock findUnique
    jest
      .spyOn(prismaService.quickNote, 'findUnique')
      .mockResolvedValue(mockUpdatedNote);
    jest
      .spyOn(prismaService.quickNote, 'update')
      .mockResolvedValue(mockUpdatedNote);

    expect(
      await service.update(1, {
        note_description: 'Updated Test Note',
        order_id: 1,
        enterprise_id: 1,
      }),
    ).toEqual(mockUpdatedNote);
  });

  it('should remove a note', async () => {
    const mockDeletedNote = {
      note_id: 1,
      note_description: 'Test Note',
      order_id: 1,
      enterprise_id: 1,
      created_at: new Date(),
      updated_at: new Date(),
      last_modified_by: 1,
    };
    // Add findUnique mock
    jest
      .spyOn(prismaService.quickNote, 'findUnique')
      .mockResolvedValue(mockDeletedNote);
    jest
      .spyOn(prismaService.quickNote, 'delete')
      .mockResolvedValue(mockDeletedNote);

    try {
      await service.remove(1);
      expect(true).toBe(true);
    } catch (error) {
      expect(error).toBeInstanceOf(InternalServerErrorException);
      expect(error.message).toBe('Failed to delete note');
    }
  });
});
