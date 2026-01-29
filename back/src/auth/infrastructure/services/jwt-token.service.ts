import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from '../../domain/services/token-service';

@Injectable()
export class JwtTokenService implements TokenService {
  constructor(private readonly jwt: JwtService) {}

  signAccessToken(payload: Record<string, unknown>): Promise<string> {
    return this.jwt.signAsync(payload);
  }
}
