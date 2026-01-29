import { ConflictException } from '@nestjs/common';
import { RegisterUserUseCase } from './register-user.use-case';
import { UserRepository } from '../../domain/repositories/user.repository';
import { PasswordHasher } from '../../domain/services/password-hasher';
import { TokenService } from '../../domain/services/token-service';
import { RegisterUserCommand } from '../dto/register-user.command';

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

describe('RegisterUserUseCase', () => {
  const command = new RegisterUserCommand('user@example.com', 'password123');

  it('crea usuario y devuelve access token', async () => {
    const { repo, hasher, tokens } = makeMocks();
    repo.findByEmail.mockResolvedValue(null);
    hasher.hash.mockResolvedValue('hashed');
    const createdUser = {
      id: 'uuid',
      email: command.email,
      passwordHash: 'hashed',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    repo.create.mockResolvedValue(createdUser);
    tokens.signAccessToken.mockResolvedValue('jwt-token');

    const useCase = new RegisterUserUseCase(repo, hasher, tokens);
    const result = await useCase.execute(command);

    expect(repo.findByEmail).toHaveBeenCalledWith(command.email);
    expect(hasher.hash).toHaveBeenCalledWith(command.password);
    expect(repo.create).toHaveBeenCalledWith({ email: command.email, passwordHash: 'hashed' });
    expect(tokens.signAccessToken).toHaveBeenCalledWith({ sub: createdUser.id, email: createdUser.email });
    expect(result).toEqual({ user: createdUser, accessToken: 'jwt-token' });
  });

  it('lanza ConflictException si el email ya existe', async () => {
    const { repo, hasher, tokens } = makeMocks();
    repo.findByEmail.mockResolvedValue({} as any);
    const useCase = new RegisterUserUseCase(repo, hasher, tokens);

    await expect(useCase.execute(command)).rejects.toBeInstanceOf(ConflictException);
    expect(repo.create).not.toHaveBeenCalled();
    expect(tokens.signAccessToken).not.toHaveBeenCalled();
  });
});
