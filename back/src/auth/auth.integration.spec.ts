import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AuthController } from './presentation/auth.controller';
import { RegisterUserUseCase } from './application/use-cases/register-user.use-case';
import { LoginUserUseCase } from './application/use-cases/login-user.use-case';
import { UserRepository } from './domain/repositories/user.repository';
import { PasswordHasher } from './domain/services/password-hasher';
import { TokenService } from './domain/services/token-service';

class InMemoryUserRepository implements UserRepository {
  private users: any[] = [];

  async findByEmail(email: string) {
    return this.users.find((u) => u.email === email) ?? null;
  }

  async create(data: { email: string; passwordHash: string }) {
    const user = {
      id: `user-${this.users.length + 1}`,
      email: data.email,
      passwordHash: data.passwordHash,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.push(user);
    return user;
  }
}

class FakePasswordHasher implements PasswordHasher {
  async hash(plain: string) {
    return `hashed-${plain}`;
  }
  async compare(plain: string, hash: string) {
    return hash === `hashed-${plain}`;
  }
}

class FakeTokenService implements TokenService {
  async signAccessToken() {
    return 'access-token';
  }
}

describe('Auth integration (controller + use cases)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: 'USER_REPO', useClass: InMemoryUserRepository },
        { provide: 'HASHER', useClass: FakePasswordHasher },
        { provide: 'TOKEN', useClass: FakeTokenService },
        {
          provide: RegisterUserUseCase,
          useFactory: (repo: UserRepository, hasher: PasswordHasher, token: TokenService) =>
            new RegisterUserUseCase(repo, hasher, token),
          inject: ['USER_REPO', 'HASHER', 'TOKEN'],
        },
        {
          provide: LoginUserUseCase,
          useFactory: (repo: UserRepository, hasher: PasswordHasher, token: TokenService) =>
            new LoginUserUseCase(repo, hasher, token),
          inject: ['USER_REPO', 'HASHER', 'TOKEN'],
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('registers a user and returns access token', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'test@example.com', password: 'changeme123' })
      .expect(201);

    expect(res.body).toMatchObject({
      email: 'test@example.com',
      accessToken: 'access-token',
    });
    expect(res.body.id).toBeDefined();
  });

  it('allows login for the registered user', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@example.com', password: 'changeme123' })
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual({ accessToken: 'access-token' });
      });
  });
});
