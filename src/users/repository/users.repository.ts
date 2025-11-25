import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../config/entities/user.entity';
import { Repository } from 'typeorm';
import { IUsersRepository } from '../interface/users.repository.interface';

@Injectable()
export class UsersRepository implements IUsersRepository {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findOne(user: Partial<User>) {
    return await this.userRepository.findOne({
      where: user,
    });
  }

  async save(user: User): Promise<User> {
    return await this.userRepository.save(user);
  }

  async create(data: Partial<User>): Promise<User> {
    return await this.userRepository.create(data);
  }
}
