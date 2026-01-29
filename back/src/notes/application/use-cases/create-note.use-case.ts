import { Note } from '../../domain/entities/note.entity';
import { NoteRepository } from '../../domain/repositories/note.repository';
import { CreateNoteCommand } from '../dto/create-note.command';

export class CreateNoteUseCase {
  constructor(private readonly noteRepository: NoteRepository) {}

  execute(command: CreateNoteCommand): Promise<Note> {
    return this.noteRepository.create({
      userId: command.userId,
      title: command.title,
      content: command.content,
    });
  }
}
