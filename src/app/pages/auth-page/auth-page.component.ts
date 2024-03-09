import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { CardModule } from 'primeng/card';

import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ButtonModule } from 'primeng/button';

enum AuthPageAction {
   LOGIN,
   REGISTER,
}

@Component({
   selector: 'app-auth-page',
   standalone: true,
   imports: [CardModule, ButtonModule, RegisterComponent, LoginComponent],
   templateUrl: './auth-page.component.html',
   styleUrl: './auth-page.component.scss',
})
export class AuthPageComponent {
   AuthPageAction = AuthPageAction;
   selecedAction: AuthPageAction = AuthPageAction.LOGIN;

   constructor(private fb: FormBuilder) {}

   switchAction() {
      this.selecedAction =
         this.selecedAction == AuthPageAction.LOGIN
            ? AuthPageAction.REGISTER
            : AuthPageAction.LOGIN;
   }
}
