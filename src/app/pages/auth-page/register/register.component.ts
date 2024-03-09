import { Component } from '@angular/core';

import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';

import { AccountApiService } from '../../../core/api';
import { AccountCreate } from '../../../core/model/accountCreate';

@Component({
   selector: 'app-register',
   standalone: true,
   imports: [
      ReactiveFormsModule,
      InputTextModule,
      ButtonModule,
      FloatLabelModule,
   ],
   providers: [AccountApiService],
   templateUrl: './register.component.html',
   styleUrl: './register.component.scss',
})
export class RegisterComponent {
   form = this.fb.group({
      username: [
         '',
         [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(32),
         ],
      ],
      email: ['', [Validators.required, Validators.email]],
      password: [
         '',
         [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(32),
         ],
      ],
   });

   constructor(
      private fb: FormBuilder,
      private accountApiService: AccountApiService
   ) {}

   register() {
      if (this.form.invalid) {
         return;
      }

      const accountCreate: AccountCreate = {
         username: this.form.get('username')!.value as string,
         email: this.form.get('email')!.value as string,
         password: this.form.get('password')!.value as string,
      };

      this.accountApiService.createAccount(accountCreate).subscribe({
         next: (account) => {
            console.log(account);
         },
         error: (err) => {
            console.log(err);
         },
      });
   }
}
