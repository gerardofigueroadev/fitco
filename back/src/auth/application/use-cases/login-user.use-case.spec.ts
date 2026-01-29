import { UnauthorizedException } from '@nestjs/common';
import { LoginUserUseCase } from './login-user.use-case';
import { UserRepository } from '../../domain/repositories/user.repository';
import { PasswordHasher } from '../../domain/services/password-hasher';
import { TokenService } from '../../domain/services/token-service';
import { LoginUserCommand } from '../dto/login-user.command';

const makeMocks = () => {
  const repo: jest.Mocked<UserRepository> = {
    findByEmail: jest.fn(),
    create: jest.fn(),
  };
  const hasher: jest.Mocked<PasswordHasher> = {
    hash: jest.fn(),
    compare: jest.fn(),
  };
  const tokens: jest.Mocked<TokenService> = {
    signAccessToken: jest.fn(),
  };
  return { repo, hasher, tokens };
};

describe('LoginUserUseCase', () => {
  const command = new LoginUserCommand('user@example.com', 'password123');
  const user = {
    id: 'uuid',
    email: command.email,
    passwordHash: 'hashed',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it('retorna access token si las credenciales son válidas', async () => {
    const { repo, hasher, tokens } = makeMocks();
    repo.findByEmail.mockResolvedValue(user);
    hasher.compare.mockResolvedValue(true);
    tokens.signAccessToken.mockResolvedValue('jwt-token');

    const useCase = new LoginUserUseCase(repo, hasher, tokens);
    const result = await useCase.execute(command);

    expect(repo.findByEmail).toHaveBeenCalledWith(command.email);
    expect(hasher.compare).toHaveBeenCalledWith(command.password, user.passwordHash);
    expect(tokens.signAccessToken).toHaveBeenCalledWith({ sub: user.id, email: user.email });
    expect(result).toEqual({ accessToken: 'jwt-token' });
  });

  it('lanza Unauthorized si el usuario no existe', async () => {
    const { repo, hasher, tokens } = makeMocks();
    repo.findByEmail.mockResolvedValue(null);
    const useCase = new LoginUserUseCase(repo, hasher, tokens);

    await expect(useCase.execute(command)).rejects.toBeInstanceOf(UnauthorizedException);
    expect(hasher.compare).not.toHaveBeenCalled();
    expect(tokens.signAccessToken).not.toHaveBeenCalled();
  });

  it('lanza Unauthorized si el password no coincide', async () => {
    const { repo, hasher, tokens } = makeMocks();
    repo.findByEmail.mockResolvedValue(user);
    hasher.compare.mockResolvedValue(false);
    const useCase = new LoginUserUseCase(repo, hasher, tokens);

    await expect(useCase.execute(command)).rejects.toBeInstanceOf(UnauthorizedException);
    expect(tokens.signAccessToken).not.toHaveBeenCalled();
  });
});
