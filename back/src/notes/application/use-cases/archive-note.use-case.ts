import { NotFoundException } from '@nestjs/common';
import { NoteRepository } from '../../domain/repositories/note.repository';
import { ArchiveNoteCommand } from '../dto/archive-note.command';
import { Note } from '../../domain/entities/note.entity';

export class ArchiveNoteUseCase {
  constructor(private readonly noteRepository: NoteRepository) {}

  async execute(command: ArchiveNoteCommand): Promise<Note> {
    const note = await this.noteRepository.archive(command.noteId, command.userId);
    if (!note) {
      throw new NotFoundException('Note not found');
    }
    return note;
  }
}
