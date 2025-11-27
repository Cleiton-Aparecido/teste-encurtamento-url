import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/config/entities/user.entity';
import { UsersController } from './controllers/users.controller';
import { IUsersRepository } from './interface/users.repository.interface';
import { UseCaseProvider } from './providers/user.provider';
import { UsersRepository } from './repository/users.repository';
import { UsersService } from './services/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersRepository,
    UseCaseProvider,
    {
      provide: IUsersRepository,
      useClass: UsersRepository,
    },
  ],
  exports: [IUsersRepository],
})
export class UsersModule {}
