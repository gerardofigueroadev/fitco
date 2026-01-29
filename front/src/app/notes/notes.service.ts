import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { CreateNoteDto, Note } from './note.model';

@Injectable({ providedIn: 'root' })
export class NotesService {
  private readonly BASE_URL = 'http://localhost:3000';

  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService
  ) {}

  getNotes(): Observable<Note[]> {
    return this.http.get<Note[]>(`${this.BASE_URL}/notes`, {
      headers: this.authHeaders()
    });
  }

  createNote(payload: CreateNoteDto): Observable<Note> {
    return this.http.post<Note>(`${this.BASE_URL}/notes`, payload, {
      headers: this.authHeaders()
    });
  }

  archiveNote(id: string): Observable<Note> {
    return this.http.patch<Note>(`${this.BASE_URL}/notes/${id}/archive`, {}, {
      headers: this.authHeaders()
    });
  }

  private authHeaders(): HttpHeaders {
    const token = this.authService.token;
    return token
      ? new HttpHeaders({ Authorization: `Bearer ${token}` })
      : new HttpHeaders();
  }
}
