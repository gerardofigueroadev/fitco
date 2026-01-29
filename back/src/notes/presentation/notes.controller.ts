import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query, Req, UseGuards } from '@nestjs/common';
import { CreateNoteUseCase } from '../application/use-cases/create-note.use-case';
import { ListNotesUseCase } from '../application/use-cases/list-notes.use-case';
import { CreateNoteRequestDto } from './dto/create-note.request';
import { CreateNoteCommand } from '../application/dto/create-note.command';
import { ListNotesQuery } from '../application/dto/list-notes.query';
import { JwtAuthGuard } from '../../auth/infrastructure/guards/jwt-auth.guard';

@Controller('notes')
@UseGuards(JwtAuthGuard)
export class NotesController {
  constructor(
    private readonly createNote: CreateNoteUseCase,
    private readonly listNotes: ListNotesUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: CreateNoteRequestDto, @Req() req: any) {
    const userId = req.user?.sub;
    const note = await this.createNote.execute(new CreateNoteCommand(userId, body.title, body.content));
    return note;
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Req() req: any) {
    const userId = req.user?.sub;
    const notes = await this.listNotes.execute(new ListNotesQuery(userId));
    return notes;
  }
}
