import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { NotesService } from '../notes/notes.service';
import { Note } from '../notes/note.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  private readonly notesService = inject(NotesService);
  private readonly fb = inject(FormBuilder);

  notes = signal<Note[]>([]);
  loading = signal(false);
  creating = signal(false);
  archiving = signal<Set<string>>(new Set());
  feedback = signal<string | null>(null);

  form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    content: ['', [Validators.required, Validators.minLength(5)]]
  });

  readonly activeNotes = computed(() => this.notes().filter((n) => !n.archived));
  readonly archivedNotes = computed(() => this.notes().filter((n) => n.archived));

  ngOnInit(): void {
    this.fetchNotes();
  }

  fetchNotes(): void {
    this.loading.set(true);
    this.notesService
      .getNotes()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (data) => this.notes.set(data),
        error: () => this.feedback.set('No se pudieron cargar las notas')
      });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.form.getRawValue();
    this.creating.set(true);

    this.notesService
      .createNote(payload)
      .pipe(finalize(() => this.creating.set(false)))
      .subscribe({
        next: (note) => {
          this.notes.update((prev) => [note, ...prev]);
          this.form.reset();
          this.feedback.set('Nota creada correctamente');
        },
        error: () => this.feedback.set('No se pudo crear la nota')
      });
  }

  formattedDate(date: string): string {
    return new Date(date).toLocaleString();
  }

  archive(note: Note): void {
    if (this.archiving().has(note.id)) {
      return;
    }

    this.archiving.update((set) => {
      const copy = new Set(set);
      copy.add(note.id);
      return copy;
    });

    this.notesService
      .archiveNote(note.id)
      .pipe(
        finalize(() => {
          this.archiving.update((set) => {
            const copy = new Set(set);
            copy.delete(note.id);
            return copy;
          });
        })
      )
      .subscribe({
        next: (updated) => {
          this.notes.update((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
        },
        error: () => this.feedback.set('No se pudo archivar la nota')
      });
  }

  isArchiving(id: string): boolean {
    return this.archiving().has(id);
  }
}
