import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import { Credentials, LoginResult } from './credentials';

/**
 * Authentication boundary: encapsulates credential validation and orchestration.
 * Keeps UI components focused on presentation and interaction.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly BASE_URL = 'http://localhost:3000';
  private readonly TOKEN_KEY = 'fitco_access_token';

  constructor(private readonly http: HttpClient) {}

  login(credentials: Credentials): Observable<LoginResult> {
    const url = `${this.BASE_URL}/auth/login`;
    return this.http.post<{ accessToken: string }>(url, credentials).pipe(
      map((response) => ({
        success: true,
        message: 'Ingreso exitoso, bienvenido 👋',
        accessToken: response.accessToken
      })),
      tap((result) => {
        if (result.accessToken) {
          this.setToken(result.accessToken);
        }
      })
    );
  }

  register(credentials: Credentials): Observable<LoginResult> {
    const url = `${this.BASE_URL}/auth/register`;
    return this.http.post<{ accessToken: string }>(url, credentials).pipe(
      map((response) => ({
        success: true,
        message: 'Registro exitoso, bienvenido 👋',
        accessToken: response.accessToken
      })),
      tap((result) => {
        if (result.accessToken) {
          this.setToken(result.accessToken);
        }
      })
    );
  }

  get token(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  clearToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }
}
