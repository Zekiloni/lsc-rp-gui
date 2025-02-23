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
               import('./pages/home-page').then(m => m.HomePageComponent),
         },
         {
            title: 'O nama',
            path: 'about',
            loadComponent: () =>
               import('./pages/about-page').then(m => m.AboutPageComponent),
         },
         {
            title: 'Autorizacija',
            path: 'auth',
            loadComponent: () =>
               import('./pages/auth-page').then(m => m.AuthPageComponent),
         },
         {
            title: 'Resetiranje šifre',
            path: 'password-reset/:token',
            loadComponent: () =>
               import('./pages/password-reset-page').then(m => m.PasswordResetPageComponent),
         },
         {
            title: 'User Control Panel',
            path: 'ucp',
            canActivate: [authGuard],
            loadComponent: () =>
               import('./pages/dashboard-page').then(m => m.DashboardPageComponent),
         },
         {
            title: 'Server Statistika',
            path: 'server',
            canActivate: [authGuard],
            loadComponent: () =>
               import('./pages/server-page').then(m => m.ServerPageComponent),
         },
         {
            title: 'World Map',
            path: 'map',
            canActivate: [authGuard],
            loadComponent: () =>
               import('./pages/world-map-page').then(m => m.WorldMapPageComponent),
         },
         {
            title: 'Premium Panel',
            path: 'premium',
            canActivate: [authGuard],
            loadComponent: () =>
               import('./pages/premium-panel-page').then(m => m.PremiumPanelPageComponent),
         },
         {
            title: 'Podešavanja računa',
            path: 'settings',
            canActivate: [authGuard],
            loadComponent: () =>
               import('./pages/account-settings-page').then(m => m.AccountSettingsPageComponent),
         },
         {
            title: 'Pregled karaktera',
            path: 'character/:id',
            canActivate: [authGuard],
            loadComponent: () =>
               import('./pages/character-view-page').then(m => m.CharacterViewPageComponent),
         },
         {
            title: 'Podesavanje karaktera',
            path: 'character/:id/settings',
            canActivate: [authGuard],
            loadComponent: () =>
               import('./pages/character-settings-page').then(m => m.CharacterSettingsPageComponent),
         },
         {
            title: 'Faction panel',
            path: 'character/:id/faction',
            canActivate: [authGuard],
            loadComponent: () =>
               import('./pages/faction-panel-page').then(m => m.FactionPanelPageComponent),
         },
         {
            title: 'Admin Panel',
            path: 'admin',
            canActivate: [authGuard, adminGuard],
            loadComponent: () => import('./pages/admin-panel-page').then(m => m.AdminPanelPageComponent),
            children: [
               {
                  path: '',
                  loadComponent: () =>
                     import('./pages/admin-panel-page/admin-dashboard').then(m => m.AdminDashboardComponent),
               },
               {
                  path: 'accounts',
                  loadComponent: () =>
                     import('./pages/admin-panel-page/manage-accounts').then(m => m.ManageAccountsComponent),
               },
               {
                  path: 'characters',
                  loadComponent: () =>
                     import('./pages/admin-panel-page/manage-characters').then(m => m.ManageCharactersComponent),
               },
               {
                  path: 'pending/characters',
                  loadComponent: () =>
                     import('./pages/admin-panel-page/manage-pending-characters').then(m => m.ManagePendingCharactersComponent),
               },
            ],
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
