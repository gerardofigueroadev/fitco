import { Module } from '@nestjs/common';
import { PrismaService } from '../shared/prisma.service';
import { NotePrismaRepository } from './infrastructure/repositories/note-prisma.repository';
import { CreateNoteUseCase } from './application/use-cases/create-note.use-case';
import { ListNotesUseCase } from './application/use-cases/list-notes.use-case';
import { NoteRepository } from './domain/repositories/note.repository';
import { NotesController } from './presentation/notes.controller';
import { AuthModule } from '../auth/auth.module';

const NOTE_REPOSITORY = Symbol('NoteRepository');

@Module({
  imports: [AuthModule],
  controllers: [NotesController],
  providers: [
    PrismaService,
    NotePrismaRepository,
    {
      provide: NOTE_REPOSITORY,
      useExisting: NotePrismaRepository,
    },
    {
      provide: CreateNoteUseCase,
      useFactory: (repo: NoteRepository) => new CreateNoteUseCase(repo),
      inject: [NOTE_REPOSITORY],
    },
    {
      provide: ListNotesUseCase,
      useFactory: (repo: NoteRepository) => new ListNotesUseCase(repo),
      inject: [NOTE_REPOSITORY],
    },
  ],
})
export class NotesModule {}
