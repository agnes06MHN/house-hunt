import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth.module';
import { PrismaModule } from './prisma.module';
import { MapModule } from './map.module';
import { FavsModule } from './favs.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '48h' },
    }),
    PrismaModule,
    AuthModule,
    MapModule,
    FavsModule,
  ],
})
export class AppModule {}
