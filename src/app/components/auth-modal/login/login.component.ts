import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { DialogService } from 'primeng/dynamicdialog';
import { FloatLabelModule } from 'primeng/floatlabel';

import { Authentication } from '../../../core/model/models';
import { PasswordResetComponent } from '../password-reset';

export const PASSWORD_VALIDATORS = [
   Validators.required,
   Validators.minLength(6),
   Validators.maxLength(32),
];

export const USERNAME_VALIDATORS = [
   Validators.required,
   Validators.minLength(3),
   Validators.maxLength(32),
];

@Component({
   selector: 'app-login',
   standalone: true,
   imports: [
      ReactiveFormsModule,
      InputTextModule,
      ButtonModule,
      FloatLabelModule,
      CheckboxModule,
   ],
   providers: [DialogService],
   templateUrl: './login.component.html',
   styleUrl: './login.component.scss',
})
export class LoginComponent {
   @Output() onAuthSubmit = new EventEmitter<Authentication>();

   form = this.formBuilder.group({
      username: ['', USERNAME_VALIDATORS],
      password: ['', PASSWORD_VALIDATORS],
   });

   constructor(private formBuilder: FormBuilder, private dialogService: DialogService) {
   }

   login() {
      if (this.form.invalid) {
         return;
      }

      const username = this.form.get<string>('username')!.value;
      const password = this.form.get<string>('password')!.value;

      this.onAuthSubmit.emit({ username, password });
   }

   openPasswordResetRequestDialog() {
      this.dialogService.open(PasswordResetComponent, {
         header: 'Reset korisničke šifre',
      });
   }
}
