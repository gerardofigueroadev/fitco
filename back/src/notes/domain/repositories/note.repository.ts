import { Note } from '../entities/note.entity';

export interface NoteRepository {
  create(data: { userId: string; title: string; content: string }): Promise<Note>;
  listByUserId(userId: string): Promise<Note[]>;
}
