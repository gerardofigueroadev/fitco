import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/prisma.service';
import { NoteRepository } from '../../domain/repositories/note.repository';
import { Note } from '../../domain/entities/note.entity';

@Injectable()
export class NotePrismaRepository implements NoteRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: { userId: string; title: string; content: string }): Promise<Note> {
    return this.prisma.note.create({
      data: {
        userId: data.userId,
        title: data.title,
        content: data.content,
      },
    });
  }

  listByUserId(userId: string): Promise<Note[]> {
    return this.prisma.note.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async archive(noteId: string, userId: string): Promise<Note | null> {
    const note = await this.prisma.note.findFirst({ where: { id: noteId, userId } });
    if (!note) return null;

    return this.prisma.note.update({
      where: { id: noteId },
      data: { archived: true, updatedAt: new Date() },
    });
  }
}
