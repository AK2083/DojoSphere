import { Routes } from '@angular/router';
import { Register } from '@features/register/components/register/register';

export const routes: Routes = [
    { path: 'auth', component: Register },
    { path: '', redirectTo: '/auth', pathMatch: 'full' },
    { path: 'signin', loadComponent: () => import('@features/signin/components/signin/signin').then(m => m.Signin) }
];
