import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class FavsService {
  constructor(private readonly prisma: PrismaService) {}

  async getFavs(userId: string) {
    return await this.prisma.favorite.findMany({
      where: { userId },
    });
  }

  async addFav(userId: string, title: string, link: string) {
    return await this.prisma.favorite.create({
      data: {
        link,
        title,
        userId,
      },
    });
  }

  async deleteFav(id: string) {
    return await this.prisma.favorite.delete({
      where: {
        id,
      },
    });
  }
}
