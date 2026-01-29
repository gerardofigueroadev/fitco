import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './auth/register/register.component';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    title: 'Login | FitCo'
  },
  {
    path: 'register',
    component: RegisterComponent,
    title: 'Registro | FitCo'
  },
  {
    path: 'home',
    component: HomeComponent,
    title: 'Home | FitCo',
    canMatch: [authGuard]
  }
];
