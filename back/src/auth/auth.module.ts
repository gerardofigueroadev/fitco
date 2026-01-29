import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from '../shared/prisma.service';
import { UserPrismaRepository } from './infrastructure/repositories/user-prisma.repository';
import { BcryptPasswordHasher } from './infrastructure/services/bcrypt-password-hasher.service';
import { AuthController } from './presentation/auth.controller';
import { RegisterUserUseCase } from './application/use-cases/register-user.use-case';
import { UserRepository } from './domain/repositories/user.repository';
import { PasswordHasher } from './domain/services/password-hasher';
import { TokenService } from './domain/services/token-service';
import { JwtTokenService } from './infrastructure/services/jwt-token.service';
import { LoginUserUseCase } from './application/use-cases/login-user.use-case';
import { JwtAuthGuard } from './infrastructure/guards/jwt-auth.guard';

const USER_REPOSITORY = Symbol('UserRepository');
const PASSWORD_HASHER = Symbol('PasswordHasher');
const TOKEN_SERVICE = Symbol('TokenService');

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev-secret',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    PrismaService,
    UserPrismaRepository,
    BcryptPasswordHasher,
    JwtTokenService,
    JwtAuthGuard,
    {
      provide: USER_REPOSITORY,
      useExisting: UserPrismaRepository,
    },
    {
      provide: PASSWORD_HASHER,
      useExisting: BcryptPasswordHasher,
    },
    {
      provide: TOKEN_SERVICE,
      useExisting: JwtTokenService,
    },
    {
      provide: RegisterUserUseCase,
      useFactory: (repo: UserRepository, hasher: PasswordHasher, token: TokenService) =>
        new RegisterUserUseCase(repo, hasher, token),
      inject: [USER_REPOSITORY, PASSWORD_HASHER, TOKEN_SERVICE],
    },
    {
      provide: LoginUserUseCase,
      useFactory: (repo: UserRepository, hasher: PasswordHasher, token: TokenService) =>
        new LoginUserUseCase(repo, hasher, token),
      inject: [USER_REPOSITORY, PASSWORD_HASHER, TOKEN_SERVICE],
    },
  ],
  exports: [JwtModule, JwtAuthGuard],
})
export class AuthModule {}
