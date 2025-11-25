import { CreateUserDto } from '../dto/create-user.dto';

export abstract class UsersUseCase {
  abstract create(
    createUserDto: CreateUserDto,
  ): Promise<{ statusCode: number; message: string }>;
}
