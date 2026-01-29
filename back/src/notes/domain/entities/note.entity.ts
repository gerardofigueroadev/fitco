export interface Note {
  id: string;
  userId: string;
  title: string;
  content: string;
  archived: boolean;
  createdAt: Date;
  updatedAt: Date;
}
