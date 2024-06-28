import { Component, EventEmitter, Output } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';

import { AccountCreate } from '../../../core/model/models';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
   selector: 'app-register',
   standalone: true,
   imports: [
      ReactiveFormsModule,
      InputTextModule,
      ButtonModule,
      FloatLabelModule,
      ToastModule
   ],
   templateUrl: './register.component.html',
   styleUrl: './register.component.scss',
})
export class RegisterComponent {
   @Output() submit = new EventEmitter<AccountCreate>();

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
      confirmPassword: [
         '', [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(32),
         ],
      ],
   });

   constructor(private fb: FormBuilder, private messageService: MessageService) {
   }

   register() {
      if (this.form.invalid) {
         return;
      }

      if (this.form.get('password')!.value != this.form.get('confirmPassword')!.value) {
         return this.messageService.add({ severity: 'error', summary: 'confirm not match '})
      }

      const accountCreate: AccountCreate = {
         username: this.form.get('username')!.value as string,
         email: this.form.get('email')!.value as string,
         password: this.form.get('password')!.value as string,
      };

      this.submit.emit(accountCreate);
   }
}
