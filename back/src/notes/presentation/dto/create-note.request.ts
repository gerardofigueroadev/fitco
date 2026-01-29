import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateNoteRequestDto {
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  title: string;

  @IsString()
  @MinLength(1)
  content: string;
}
