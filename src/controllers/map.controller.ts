import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { MapService } from 'src/services/map.service';

interface IGetAvailablePlacesQuery {
  first_address: string;
  second_address?: string;
  third_address?: string;
}

@Controller('map')
export class MapController {
  constructor(private readonly mapService: MapService) {}

  @UseGuards(AuthGuard)
  @Get('points_from_addresses')
  @HttpCode(HttpStatus.OK)
  async getAvailablePlaces(@Query() addresses: IGetAvailablePlacesQuery) {
    return await this.mapService.getCenteredPointFromAddresses(
      Object.values(addresses)
    );
  }
}
