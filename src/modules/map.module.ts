import { Module } from '@nestjs/common';
import { MapController } from 'src/controllers/map.controller';
import { MapService } from 'src/services/map.service';

@Module({
  controllers: [MapController],
  providers: [MapService],
})
export class MapModule {}
