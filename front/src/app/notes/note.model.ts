export interface Note {
  id: string;
  userId: string;
  title: string;
  content: string;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNoteDto {
  title: string;
  content: string;
}
