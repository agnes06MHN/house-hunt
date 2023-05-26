import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { PrismaService } from './prisma.service';
import { AuthDto } from 'src/dtos/auth/auth.dto';

const SALT_ROUNDS = 10;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async logIn(authLogInDto: AuthDto) {
    const user = await this.prisma.user.findFirst({
      where: { email: authLogInDto.email },
    });

    if (!user || !compare(authLogInDto.password, user?.password)) {
      throw new UnauthorizedException();
    }

    const payload = { username: authLogInDto.email, sub: user.id };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userDto } = user;

    return {
      accessToken: await this.jwtService.signAsync(payload),
      ...userDto,
    };
  }

  async register(authRegisterDto: AuthDto) {
    const user = await this.prisma.user.findFirst({
      where: { email: authRegisterDto.email },
    });
    if (user) throw new UnauthorizedException();

    authRegisterDto.password = await hash(
      authRegisterDto.password,
      SALT_ROUNDS,
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...dto } = await this.prisma.user.create({
      data: authRegisterDto,
    });
    return dto;
  }
}
