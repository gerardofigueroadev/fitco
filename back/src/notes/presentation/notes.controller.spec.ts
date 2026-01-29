import { Test } from '@nestjs/testing';
import { NotesController } from './notes.controller';
import { CreateNoteUseCase } from '../application/use-cases/create-note.use-case';
import { ListNotesUseCase } from '../application/use-cases/list-notes.use-case';
import { JwtAuthGuard } from '../../auth/infrastructure/guards/jwt-auth.guard';
import { ExecutionContext } from '@nestjs/common';

describe('NotesController', () => {
  let controller: NotesController;
  let createUseCase: jest.Mocked<CreateNoteUseCase>;
  let listUseCase: jest.Mocked<ListNotesUseCase>;

  beforeEach(async () => {
    createUseCase = { execute: jest.fn() } as any;
    listUseCase = { execute: jest.fn() } as any;

    const moduleRef = await Test.createTestingModule({
      controllers: [NotesController],
      providers: [
        { provide: CreateNoteUseCase, useValue: createUseCase },
        { provide: ListNotesUseCase, useValue: listUseCase },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest();
          req.user = { sub: 'user-123' };
          return true;
        },
      })
      .compile();

    controller = moduleRef.get(NotesController);
  });

  it('crea una nota para el usuario autenticado', async () => {
    const note = {
      id: 'note-1',
      userId: 'user-123',
      title: 'title',
      content: 'content',
      archived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    createUseCase.execute.mockResolvedValue(note);

    const result = await controller.create(
      { title: 'title', content: 'content' },
      { user: { sub: 'user-123' } } as any,
    );

    expect(createUseCase.execute).toHaveBeenCalledWith({
      userId: 'user-123',
      title: 'title',
      content: 'content',
    });
    expect(result).toEqual(note);
  });

  it('lista las notas del usuario autenticado', async () => {
    const notes = [
      {
        id: 'note-1',
        userId: 'user-123',
        title: 'title',
        content: 'content',
        archived: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    listUseCase.execute.mockResolvedValue(notes);

    const result = await controller.findAll({ user: { sub: 'user-123' } } as any);

    expect(listUseCase.execute).toHaveBeenCalledWith({ userId: 'user-123' });
    expect(result).toEqual(notes);
  });
});
