import { Routes } from '@angular/router';
import { authGuard } from './core/guard/auth.guard';

export const routes: Routes = [
   {
      path: '',
      loadComponent: () =>
         import('./layouts/landing-layout').then(
            (m) => m.LandingLayoutComponent,
         ),
      children: [
         {
            title: 'Home',
            path: '',
            loadComponent: () =>
               import('./pages/home-page').then((m) => m.HomePageComponent),
         },
      ],
   },
   {
      path: 'ucp',
      canActivate: [authGuard],
      loadComponent: () =>
         import('./layouts/dashboard-layout').then(
            (m) => m.DashboardLayoutComponent,
         ),
      children: [
         {
            title: 'Dashboard',
            path: '',
            loadComponent: () =>
               import('./pages/dashboard-page').then((m) => m.DashboardPageComponent),
         },
      ],
   },

   {
      path: '**',
      pathMatch: 'full',
      loadComponent: () =>
         import('./pages/not-found-page').then((m) => m.NotFoundPageComponent),
   },
];
