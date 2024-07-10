import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';

import { Authentication } from '../../../core/model/authentication';

@Component({
   selector: 'app-login',
   standalone: true,
   imports: [
      ReactiveFormsModule,
      InputTextModule,
      ButtonModule,
      FloatLabelModule,
   ],
   templateUrl: './login.component.html',
   styleUrl: './login.component.scss',
})
export class LoginComponent {
   @Output() onAuthSubmit = new EventEmitter<Authentication>();

   form = this.fb.group({
      username: [
         '',
         [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(32),
         ],
      ],
      password: [
         '',
         [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(32),
         ],
      ],
   });

   constructor(private fb: FormBuilder) {}

   login() {
      if (this.form.invalid) {
         return;
      }

      const username = <string>this.form.get('username')!.value;
      const password = <string>this.form.get('password')!.value;

      this.onAuthSubmit.emit({ username, password });
   }
}
