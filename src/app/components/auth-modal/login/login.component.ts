import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';

import { Authentication } from '../../../core/model/models';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogService } from 'primeng/dynamicdialog';
import { PasswordResetComponent } from '../password-reset';

export const PASSWORD_VALIDATORS = [
   Validators.required,
   Validators.minLength(6),
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
      username: ['', PASSWORD_VALIDATORS],
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
