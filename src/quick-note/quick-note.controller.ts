import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  ParseIntPipe,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { QuickNoteService } from './quick-note.service';
import { QuickNoteDto } from './dto/quick-note.dto';

@ApiTags('quick-notes')
@Controller('quick-notes')
export class QuickNoteController {
  constructor(private readonly quickNoteService: QuickNoteService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new quick note' })
  @ApiResponse({ status: HttpStatus.CREATED, type: QuickNoteDto })
  async create(@Body() quickNoteDto: QuickNoteDto): Promise<QuickNoteDto> {
    return this.quickNoteService.create(quickNoteDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all quick notes' })
  @ApiResponse({ status: HttpStatus.OK, type: [QuickNoteDto] })
  async findAll(): Promise<QuickNoteDto[]> {
    return this.quickNoteService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a quick note by id' })
  @ApiResponse({ status: HttpStatus.OK, type: QuickNoteDto })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<QuickNoteDto> {
    return this.quickNoteService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a quick note' })
  @ApiResponse({ status: HttpStatus.OK, type: QuickNoteDto })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() quickNoteDto: QuickNoteDto,
  ): Promise<QuickNoteDto> {
    return this.quickNoteService.update(id, quickNoteDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a quick note' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.quickNoteService.remove(id);
  }
}
