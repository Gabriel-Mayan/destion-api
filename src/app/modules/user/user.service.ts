import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';

import { UserRepository } from './user.repository';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findAll() {
    return this.userRepository.find();
  }

  async findById(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: string, dto: UpdateUserDto, currentUserId: string) {
    if (id !== currentUserId) {
      throw new ForbiddenException('You can only update your own profile');
    }

    const user = await this.findById(id);

    Object.assign(user, dto);

    return this.userRepository.save(user);
  }

  async remove(id: string, currentUserId: string) {
    if (id !== currentUserId) {
      throw new ForbiddenException('You can only remove your own account');
    }

    const user = await this.findById(id);

    return this.userRepository.remove(user);
  }
}
