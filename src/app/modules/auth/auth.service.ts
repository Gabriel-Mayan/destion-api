import { JwtService } from '@nestjs/jwt';
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';

import { UserRepository } from '@modules/user/user.repository';

import { RecoveryPasswordService } from '@modules/recovery-password/recovery-password.service';

import { CryptoService } from '@shared/crypto/crypto.service';

import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { SocialLoginDto } from './dto/social-login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RequestRecoveryDto } from './dto/request-recovery.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly cryptoService: CryptoService,
    private readonly userRepository: UserRepository,
    private readonly recoveryService: RecoveryPasswordService,
  ) { }

  async register(dto: RegisterDto) {
    const existingUser = await this.userRepository.findOne({ where: { email: dto.email } });

    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }

    const passwordHash = await this.cryptoService.encrypt(dto.password);
    const user = this.userRepository.create({ ...dto, password: passwordHash });

    await this.userRepository.save(user);

    const token = await this.jwtService.signAsync({ sub: user.id, email: user.email });

    return { user, token };
  }

  async login(dto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
      select: { id: true, password: true, email: true, name: true, avatarUrl: true }
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatches = await this.cryptoService.compare(dto.password, user.password);

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    };

    const token = await this.jwtService.signAsync({ sub: user.id, email: user.email });

    const formattedUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
    }

    return { user: formattedUser, token };
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

    const token = await this.jwtService.signAsync({ sub: user.id, email: user.email });

    return { user, token };
  }

  async requestPasswordRecovery(dto: RequestRecoveryDto) {
    const user = await this.userRepository.findOne({ where: { email: dto.email } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const recoveryToken = await this.recoveryService.createToken(user);

    return { recoveryToken: recoveryToken.token };
  }

  async changePassword(dto: ChangePasswordDto) {
    const recovery = await this.recoveryService.validateToken(dto.recoveryId);

    const hashedPassword = await this.cryptoService.encrypt(dto.password);

    recovery.user.password = hashedPassword;

    await this.userRepository.save(recovery.user);
    await this.recoveryService.markAsUsed(dto.recoveryId);

    return { message: 'Password changed successfully' };
  }
}
