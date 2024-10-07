import { Component, Inject } from '@angular/core';
import { RegisterComponent } from '../../components/auth-modal/register';
import { LoginComponent } from '../../components/auth-modal/login';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { AccountCreate } from '../../core/model/accountCreate';
import { AccountApiService } from '../../core/api/accountApi.service';
import { AuthenticationApiService } from '../../core/api/authenticationApi.service';
import { ApiError } from '../../core/model/apiError';
import { MessageService } from 'primeng/api';
import { Authentication } from '../../core/model/authentication';
import { SessionStorageService, StorageItemKey } from '../../core/service/session-storage.service';
import { Store } from '@ngrx/store';
import { setAccount, setAuthenticated } from '../../stores/account/account.actions';
import { Router } from '@angular/router';

enum AuthOptionType {
   SIGN_IN,
   SIGN_UP
}

@Component({
   selector: 'app-auth-page',
   standalone: true,
   imports: [
      RegisterComponent,
      LoginComponent,
      CardModule,
      ButtonModule,
   ],
   providers: [AccountApiService, AuthenticationApiService],
   templateUrl: './auth-page.component.html',
   styleUrl: './auth-page.component.scss',
})
export class AuthPageComponent {
   protected readonly AuthOptionType = AuthOptionType;

   selectedOption: AuthOptionType = AuthOptionType.SIGN_UP;

   constructor(private accountApiService: AccountApiService,
               private authApiService: AuthenticationApiService,
               private messageService: MessageService,
               private sessionStorageService: SessionStorageService,
               @Inject(Store) private readonly store: Store,
               private router: Router) {
   }

   get getHeaderTitle() {
      return this.selectedOption == AuthOptionType.SIGN_IN ? 'Prijava' : 'Registracija';
   }

   get getNavBtnLabel() {
      return this.selectedOption == AuthOptionType.SIGN_IN ? 'Kreiraj račun' : 'Već postojeći račun';
   }

   switchAuthOption() {
      this.selectedOption = this.selectedOption == AuthOptionType.SIGN_UP ?
         AuthOptionType.SIGN_IN : AuthOptionType.SIGN_UP;
   }

   handleCreateAccountSubmit(accountCreate: AccountCreate) {
      this.accountApiService.createAccount(accountCreate)
         .subscribe({
            next: (response => {
               this.messageService.add({
                  severity: 'success',
                  summary: 'Uspešno',
                  detail: `Kreirali ste račun ${response.username}, možete se prijaviti`,
               });

               this.selectedOption = AuthOptionType.SIGN_IN;
            }),

            error: (response: ApiError) => {
               this.messageService.add({
                  severity: 'error',
                  summary: 'Greška',
                  detail: response.message,
               });
            },
         });
   }

   handleAccountAuthSubmit(authentication: Authentication) {
      this.authApiService.authenticate(authentication)
         .subscribe({
            next: (response => {
               this.messageService.add({
                  severity: 'success',
                  summary: 'Uspešno',
                  detail: `Prijavili ste se na ${authentication.username}`,
               });

               this.sessionStorageService.save(
                  StorageItemKey.AccessToken,
                  response.token,
               );

               this.store.dispatch(setAuthenticated({ isAuthenticated: true }));
               this.store.dispatch(setAccount({ account: response.account }));

               this.router.navigate(['ucp']);
            }),

            error: (response: ApiError) => {
               this.messageService.add({
                  severity: 'error',
                  summary: 'Greška',
                  detail: response.message,
               });
            },
         });
   }
}
