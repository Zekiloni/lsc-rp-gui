import { Routes } from '@angular/router';

export const routes: Routes = [
   {
      path: '',
      loadComponent: () =>
         import('./layouts/landing-layout').then(
            (m) => m.LandingLayoutComponent
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
      loadComponent: () =>
         import('./layouts/dashboard-layout').then(
            (m) => m.DashboardLayoutComponent
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
      path: '**',
      pathMatch: 'full',
      loadComponent: () =>
         import('./pages/not-found-page').then((m) => m.NotFoundPageComponent),
   },
];
