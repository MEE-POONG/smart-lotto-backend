// lottery.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { LotteryService } from './lottery.service';
import { LotteryDto } from './dto/lottery.dto';

@Controller('lotteries')
export class LotteryController {
  constructor(private readonly lotteryService: LotteryService) {}

  @Post()
  create(@Body() lotteryDto: LotteryDto) {
    return this.lotteryService.create(lotteryDto);
  }

  @Get()
  findAll() {
    return this.lotteryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lotteryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() lotteryDto: LotteryDto) {
    return this.lotteryService.update(+id, lotteryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lotteryService.remove(+id);
  }
}
