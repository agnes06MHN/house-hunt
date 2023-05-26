import { Module } from '@nestjs/common';
import { FavsController } from 'src/controllers/favs.controller';
import { FavsService } from 'src/services/favs.service';

@Module({
  controllers: [FavsController],
  providers: [FavsService],
})
export class FavsModule {}
