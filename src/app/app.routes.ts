import { Routes } from '@angular/router';
import { authGuard } from './core/guard/auth.guard';

export const routes: Routes = [
   {
      path: '',
      loadComponent: () =>
         import('./layouts/main-layout').then(
            (m) => m.MainLayoutComponent,
         ),
      children: [
         {
            title: 'Home',
            path: '',
            loadComponent: () =>
               import('./pages/home-page').then((m) => m.HomePageComponent),
         },
         {
            title: 'About',
            path: 'about',
            loadComponent: () =>
               import('./pages/about-page').then((m) => m.AboutPageComponent),
         },
         {
            title: 'Dashboard',
            path: 'ucp',
            canActivate: [authGuard],
            loadComponent: () =>
               import('./pages/dashboard-page').then((m) => m.DashboardPageComponent),
         },
         {
            title: 'Account Settings',
            path: 'settings',
            canActivate: [authGuard],
            loadComponent: () =>
               import('./pages/account-settings-page').then((m) => m.AccountSettingsPageComponent),
         },
         {
            title: 'View Character',
            path: 'character/:id',
            canActivate: [authGuard],
            loadComponent: () =>
               import('./pages/character-view-page').then((m) => m.CharacterViewPageComponent),
         },
         {
            title: 'Create Character',
            path: 'create-character',
            canActivate: [authGuard],
            loadComponent: () =>
               import('./pages/create-character-page').then((m) => m.CreateCharacterPageComponent),
         },
         {
            path: '**',
            pathMatch: 'full',
            loadComponent: () =>
               import('./pages/not-found-page').then((m) => m.NotFoundPageComponent),
         },
      ],

   },
];
