import { Routes } from '@angular/router';
import { authGuard } from './core/guard/auth.guard';
import { adminGuard } from './core/guard/admin.guard';

export const routes: Routes = [
   {
      path: '',
      loadComponent: () =>
         import('./layouts/main-layout').then(
            (m) => m.MainLayoutComponent,
         ),
      children: [
         {
            title: 'Početna',
            path: '',
            loadComponent: () =>
               import('./pages/home-page').then((m) => m.HomePageComponent),
         },
         {
            title: 'O nama',
            path: 'about',
            loadComponent: () =>
               import('./pages/about-page').then((m) => m.AboutPageComponent),
         },
         {
            title: 'User Control Panel',
            path: 'ucp',
            canActivate: [authGuard],
            loadComponent: () =>
               import('./pages/dashboard-page').then((m) => m.DashboardPageComponent),
         },
         {
            title: 'Podešavanja računa',
            path: 'settings',
            canActivate: [authGuard],
            loadComponent: () =>
               import('./pages/account-settings-page').then((m) => m.AccountSettingsPageComponent),
         },
         {
            title: 'Pregled karaktera',
            path: 'character/:id',
            canActivate: [authGuard],
            loadComponent: () =>
               import('./pages/character-view-page').then((m) => m.CharacterViewPageComponent),
         },
         {
            title: 'Faction panel',
            path: 'character/:id/faction',
            canActivate: [authGuard],
            loadComponent: () =>
               import('./pages/faction-panel-page').then((m) => m.FactionPanelPageComponent),
         },
         {
            title: 'Admin Panel',
            path: 'admin',
            canActivate: [authGuard],
            loadComponent: () =>
               import('./pages/admin-panel-page').then((m) => m.AdminPanelPageComponent),
         },
         {
            title: 'Kreiranje karaktera',
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
