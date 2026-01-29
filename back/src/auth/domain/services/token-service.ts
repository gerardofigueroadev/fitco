export interface TokenService {
  signAccessToken(payload: Record<string, unknown>): Promise<string>;
}
