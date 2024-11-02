// lottery.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LotteryDto } from './dto/lottery.dto';

@Injectable()
export class LotteryService {
  constructor(private prisma: PrismaService) {}

  async create(data: LotteryDto) {
    return this.prisma.lottery.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.lottery.findMany({
      include: {
        enterprise: true,
        itemTypes: true,
        lastModifiedBy: true,
      },
    });
  }

  async findOne(id: number) {
    const lottery = await this.prisma.lottery.findUnique({
      where: { lottery_id: id },
      include: {
        enterprise: true,
        itemTypes: true,
        lastModifiedBy: true,
      },
    });
    if (!lottery) throw new NotFoundException('Lottery not found');
    return lottery;
  }

  async update(id: number, data: LotteryDto) {
    return this.prisma.lottery.update({
      where: { lottery_id: id },
      data,
    });
  }

  async remove(id: number) {
    return this.prisma.lottery.delete({
      where: { lottery_id: id },
    });
  }
}
