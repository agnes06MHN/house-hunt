import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
  Query,
  Post,
  Delete,
  Param,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { FavsService } from 'src/services/favs.service';

@Controller('favs')
export class FavsController {
  constructor(private readonly favsService: FavsService) {}

  @UseGuards(AuthGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  async getFavs(@Request() req) {
    console.log(req.user);
    return await this.favsService.getFavs(req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async addFav(@Request() req, @Query() query) {
    return await this.favsService.addFav(req.user.sub, query.title, query.link);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteFav(@Param('id') shoppingListId: string) {
    return await this.favsService.deleteFav(shoppingListId);
  }
}
