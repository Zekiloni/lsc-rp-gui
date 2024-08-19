import { Component, Inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LocalStorageService, StorageItemKey } from './core/service/local-storage.service';
import { AuthenticationApiService } from './core/api/api';
import { Store } from '@ngrx/store';
import { setAccount } from './stores/account/account.actions';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ApiError } from './core/model/apiError';

@Component({
   selector: 'app-root',
   standalone: true,
   imports: [RouterOutlet, ToastModule],
   providers: [LocalStorageService, AuthenticationApiService],
   templateUrl: './app.component.html',
   styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {

   constructor(private localStorageService: LocalStorageService,
               private authApiService: AuthenticationApiService,
               private messageService: MessageService,
               @Inject(Store) private store: Store) {
   }

   ngOnInit(): void {
      const token = this.localStorageService.retrieve<string | undefined>(StorageItemKey.AccessToken);
      if (token) {
         this.authApiService.configuration.accessToken = token;
         this.authApiService.validate().subscribe({
            next: (response) => {
               this.store.dispatch(setAccount({ account: response }));
            },
            error: (response: ApiError) => {
               this.localStorageService.delete(StorageItemKey.AccessToken);
               this.messageService.add({severity: 'error', detail: response.message})
            },
         });
      }
   }
}
