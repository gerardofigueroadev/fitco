import { ConflictException } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository';
import { PasswordHasher } from '../../domain/services/password-hasher';
import { TokenService } from '../../domain/services/token-service';
import { RegisterUserCommand } from '../dto/register-user.command';

export class RegisterUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly tokenService: TokenService,
  ) {}

  async execute(command: RegisterUserCommand): Promise<{ user: User; accessToken: string }> {
    const existing = await this.userRepository.findByEmail(command.email);
    if (existing) {
      throw new ConflictException('Email is already registered');
    }

    const passwordHash = await this.passwordHasher.hash(command.password);

    const user = await this.userRepository.create({
      email: command.email,
      passwordHash,
    });

    const accessToken = await this.tokenService.signAccessToken({
      sub: user.id,
      email: user.email,
    });

    return { user, accessToken };
  }
}
