import { ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { BASE_PATH } from './core/variables';
import { routes } from './app.routes';
import { environment } from '../environments/environment.development';

export const appConfig: ApplicationConfig = {
   providers: [
      provideHttpClient(),
      provideRouter(routes),
      provideAnimations(),
      provideToastr(),
      { provide: BASE_PATH, useValue: environment.apiBasePath },
   ],
};
