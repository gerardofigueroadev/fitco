import { IsUUID } from 'class-validator';

export class ArchiveNoteParamsDto {
  @IsUUID()
  id: string;
}
