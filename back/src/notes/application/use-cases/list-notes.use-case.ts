import { Note } from '../../domain/entities/note.entity';
import { NoteRepository } from '../../domain/repositories/note.repository';
import { ListNotesQuery } from '../dto/list-notes.query';

export class ListNotesUseCase {
  constructor(private readonly noteRepository: NoteRepository) {}

  execute(query: ListNotesQuery): Promise<Note[]> {
    return this.noteRepository.listByUserId(query.userId);
  }
}
