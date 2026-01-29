import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { AuthService } from '../auth.service';
import { Credentials, LoginResult } from '../credentials';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  form = this.fb.nonNullable.group(
    {
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    },
    { validators: RegisterComponent.passwordsMatch }
  );

  private readonly status = toSignal(this.form.statusChanges, { initialValue: this.form.status });
  feedback = signal<LoginResult | null>(null);
  submitting = signal(false);

  readonly isDisabled = computed(() => this.submitting() || this.status() === 'INVALID');

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, password } = this.form.getRawValue();
    const credentials: Credentials = { email, password };
    this.submitting.set(true);

    this.authService.register(credentials)
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: (result) => {
          this.feedback.set(result);
          if (result.success) {
            this.router.navigate(['/home']);
          }
        },
        error: () => this.feedback.set({ success: false, message: 'No se pudo registrar' })
      });
  }

  hasError(field: 'email' | 'password' | 'confirmPassword', error: string): boolean {
    const control = this.form.get(field);
    return !!control && control.touched && control.hasError(error);
  }

  static passwordsMatch(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    if (!password || !confirm) {
      return null;
    }
    return password === confirm ? null : { passwordMismatch: true };
  }
}
