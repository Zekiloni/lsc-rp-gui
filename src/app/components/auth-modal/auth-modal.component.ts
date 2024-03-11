import { Component, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { DialogModule } from 'primeng/dialog';

import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ButtonModule } from 'primeng/button';

enum AuthPageAction {
   LOGIN,
   REGISTER,
}

@Component({
   selector: 'app-auth-modal',
   standalone: true,
   imports: [DialogModule, ButtonModule, RegisterComponent, LoginComponent],
   templateUrl: './auth-modal.component.html',
   styleUrl: './auth-modal.component.scss',
})
export class AuthModalComponent {
   @Input() isAuthModalVisible!: boolean;

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
