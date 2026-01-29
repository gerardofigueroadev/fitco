import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '../auth.service';
import { Credentials, LoginResult } from '../credentials';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  private readonly status = toSignal(this.form.statusChanges, { initialValue: this.form.status });
  feedback = signal<LoginResult | null>(null);
  submitting = signal(false);

  readonly isDisabled = computed(() => this.submitting() || this.status() === 'INVALID');

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const credentials: Credentials = this.form.getRawValue();
    this.submitting.set(true);

    this.authService.login(credentials)
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: (result) => {
          this.feedback.set(result);
          if (result.success) {
            this.router.navigate(['/home']);
          }
        },
        error: () => this.feedback.set({ success: false, message: 'No se pudo iniciar sesion' })
      });
  }

  hasError(field: 'email' | 'password', error: string): boolean {
    const control = this.form.get(field);
    return !!control && control.touched && control.hasError(error);
  }
}
