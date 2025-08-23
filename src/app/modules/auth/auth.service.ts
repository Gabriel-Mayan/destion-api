import { Injectable, UnauthorizedException } from '@nestjs/common';

import { UserRepository } from '@modules/user/user.repository';

import { TokenService } from '@shared/token/token.service';
import { CryptoService } from '@shared/crypto/crypto.service';

import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { SocialLoginDto } from './dto/social-login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly cryptoService: CryptoService,
    private readonly userRepository: UserRepository,
  ) { }

  async register(dto: RegisterDto) {
    const existingUser = await this.userRepository.findOne({ where: { email: dto.email } });

    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }

    const passwordHash = await this.cryptoService.encrypt(dto.password);
    const user = this.userRepository.create({ ...dto, password: passwordHash });

    await this.userRepository.save(user);

    const token = await this.tokenService.generateToken({ sub: user.id, email: user.email });

    return { user, token };
  }

  async login(dto: LoginDto) {
    const user = await this.userRepository.findOne({ where: { email: dto.email } });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatches = await this.cryptoService.compare(dto.password, user.password);

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    };

    const token = await this.tokenService.generateToken({ sub: user.id, email: user.email });

    return { user, token };
  }

  async socialLogin(dto: SocialLoginDto) {
    let user = await this.userRepository.findOne({ where: { email: dto.email } });

    if (!user) {
      user = this.userRepository.create({
        email: dto.email,
        name: dto.name,
        avatarUrl: dto.avatarUrl,
      });

      await this.userRepository.save(user);
    }

    const token = await this.tokenService.generateToken({ sub: user.id, email: user.email });

    return { user, token };
  }

  async refreshToken(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const token = await this.tokenService.generateToken({ sub: user.id, email: user.email });

    return { user, token };
  }
}
