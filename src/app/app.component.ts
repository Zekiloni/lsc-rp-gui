import { Component, Inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SessionStorageService, StorageItemKey } from './core/service/session-storage.service';
import { AuthenticationApiService } from './core/api/api';
import { Store } from '@ngrx/store';
import { setAccount } from './stores/account/account.actions';
import { ToastModule } from 'primeng/toast';
import { SkinPreviewComponent } from './components/skin-preview/skin-preview.component';

@Component({
   selector: 'app-root',
   standalone: true,
   imports: [RouterOutlet, ToastModule, SkinPreviewComponent],
   providers: [SessionStorageService, AuthenticationApiService],
   templateUrl: './app.component.html',
   styleUrl: './app.component.scss',
})
export class AppComponent {

   constructor(private sessionStorageService: SessionStorageService,
               private authApiService: AuthenticationApiService,
               @Inject(Store) private store: Store) {
      this.validateAuth();
   }

   private validateAuth() {
      console.log('validateAuth')
      const token = this.sessionStorageService.retrieve<string | undefined>(StorageItemKey.AccessToken);
      if (token) {
         this.authApiService.configuration.accessToken = token;
         this.authApiService.validate().subscribe({
            next: (response) => {
               this.store.dispatch(setAccount({ account: response }));
            },
            error: () => {
               this.sessionStorageService.delete(StorageItemKey.AccessToken);
            },
         });
      }
   }
}
