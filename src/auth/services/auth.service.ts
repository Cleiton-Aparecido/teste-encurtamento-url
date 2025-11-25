import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { IUsersRepository } from 'src/users/interface/users.repository.interface';
import { AuthDto } from '../dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersRepository: IUsersRepository,
    private jwtService: JwtService,
  ) {}

  async validateEmail(auth: AuthDto): Promise<any> {
    const { email, password } = auth;

    const user = await this.usersRepository.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(auth: AuthDto): Promise<{ access_token: string }> {
    try {
      const user = await this.validateEmail(auth);
      if (!user) {
        throw new UnauthorizedException('Usuário ou senha inválidos');
      }

      const payload = {
        name: user.name,
        email: user.email,
        id: user.id,
      };
      return {
        access_token: this.jwtService.sign(payload, { expiresIn: '10h' }),
      };
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
