import { ApplicationConfig } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors } from '@angular/common/http';

import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';

import { MessageService } from 'primeng/api';

import { BASE_PATH } from './core/variables';
import { routes } from './app.routes';
import { environment } from '../environments/environment.development';
import { accountReducer } from './stores/account/account.reducer';
import { apiErrorInterceptor } from './core/interceptor/api-error.interceptor';
import { authInterceptor } from './core/interceptor/auth.interceptor';

export const appConfig: ApplicationConfig = {
   providers: [
      provideHttpClient(withInterceptors([authInterceptor, apiErrorInterceptor])),
      provideRouter(routes),
      provideAnimations(),
      MessageService,
      provideStore({ account: accountReducer }),
      provideEffects(),
      { provide: BASE_PATH, useValue: environment.apiBasePath },
   ],
};
