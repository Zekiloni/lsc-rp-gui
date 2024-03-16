import { Component, Inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LocalStorageService, StorageItemKey } from './core/service/local-storage.service';
import { AuthenticationApiService } from './core/api/api';
import { Store } from '@ngrx/store';
import { setAccount } from './stores/account/account.actions';

@Component({
   selector: 'app-root',
   standalone: true,
   imports: [RouterOutlet],
   providers: [LocalStorageService, AuthenticationApiService],
   templateUrl: './app.component.html',
   styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
   title = 'Zeki RP';

   constructor(private localStorageService: LocalStorageService, private authApiService: AuthenticationApiService, @Inject(Store) private store: Store) {
   }

   ngOnInit(): void {
      const token = this.localStorageService.retrieve<string | undefined>(StorageItemKey.AccessToken);

      if (token) {
         this.authApiService.configuration.accessToken = token;
         this.authApiService.validate().subscribe({
            next: (account) => {
               console.log(account)
               this.store.dispatch(setAccount({ account }));
            },
            error: (err) => {
               console.log(err);
            },
         });
      }
   }
}
