import { User } from 'src/config/entities/user.entity';
import { DeepPartial } from 'typeorm';

export abstract class IUsersRepository {
  abstract findOne(partial: Partial<User>);
  abstract save(user: DeepPartial<User>): Promise<User>;
  abstract create(data: DeepPartial<User>): Promise<User>;
}
