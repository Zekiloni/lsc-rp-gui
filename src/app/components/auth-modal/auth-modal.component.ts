import { Component, Inject } from '@angular/core';

import {
   DynamicDialogModule,
   DynamicDialogRef,
   DialogService,
   DynamicDialogComponent,
   DynamicDialogConfig,
} from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';

import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { Authentication, AccountCreate } from '../../core/model/models';
import {
   AccountApiService,
   AuthenticationApiService,
} from '../../core/api/api';
import {
   LocalStorageService,
   StorageItemKey,
} from '../../core/service/local-storage.service';
import { Store } from '@ngrx/store';
import {
   setAccount,
   setAuthenticated,
} from '../../stores/account/account.actions';

enum AuthAction {
   LOGIN,
   REGISTER,
}

@Component({
   selector: 'app-auth-modal',
   standalone: true,
   imports: [
      DynamicDialogModule,
      ButtonModule,
      RegisterComponent,
      LoginComponent,
   ],
   providers: [
      DialogService,
      AccountApiService,
      AuthenticationApiService,
      LocalStorageService,
      MessageService,
   ],
   templateUrl: './auth-modal.component.html',
   styleUrl: './auth-modal.component.scss',
})
export class AuthModalComponent {
   instance: DynamicDialogComponent | undefined;

   AuthAction = AuthAction;
   selecedAction: AuthAction = AuthAction.LOGIN;

   constructor(
      public ref: DynamicDialogRef,
      public config: DynamicDialogConfig,
      private accountApiService: AccountApiService,
      private authApiService: AuthenticationApiService,
      private localStorageService: LocalStorageService,
      @Inject(Store) private readonly store: Store,
   ) {
   }

   switchAction() {
      this.selecedAction =
         this.selecedAction == AuthAction.LOGIN
            ? AuthAction.REGISTER
            : AuthAction.LOGIN;
   }

   onCreateAccount(accountCreate: AccountCreate) {
      this.accountApiService.createAccount(accountCreate).subscribe({
         next: (response) => {
            this.ref.close();
         },
         error: (err) => {
            console.log(err);
         },
      });
   }

   onAuthAccount(auth: Authentication) {
      this.authApiService.authenticate(auth).subscribe({
         next: (response) => {
            this.localStorageService.save(
               StorageItemKey.AccessToken,
               response.token,
            );
            this.store.dispatch(setAuthenticated({ isAuthenticated: true }));
            this.store.dispatch(setAccount({ account: response.account }));
            this.ref.close(true);
         },
         error: (err) => {
            console.log(err);
         },
      });
   }
}
