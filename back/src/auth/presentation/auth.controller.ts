import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { RegisterUserUseCase } from '../application/use-cases/register-user.use-case';
import { RegisterRequestDto } from './dto/register-request.dto';
import { RegisterUserCommand } from '../application/dto/register-user.command';
import { LoginRequestDto } from './dto/login-request.dto';
import { LoginUserCommand } from '../application/dto/login-user.command';
import { LoginUserUseCase } from '../application/use-cases/login-user.use-case';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUser: RegisterUserUseCase,
    private readonly loginUser: LoginUserUseCase,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() body: RegisterRequestDto) {
    const { user, accessToken } = await this.registerUser.execute(
      new RegisterUserCommand(body.email, body.password),
    );

    return {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
      accessToken,
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginRequestDto) {
    const { accessToken } = await this.loginUser.execute(
      new LoginUserCommand(body.email, body.password),
    );

    return { accessToken };
  }
}
