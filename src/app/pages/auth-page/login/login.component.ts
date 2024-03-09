import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';

import { AuthenticationApiService } from '../../../core/api/api';
import { LocalStorageService } from '../../../core/service/service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
   selector: 'app-login',
   standalone: true,
   imports: [
      ReactiveFormsModule,
      InputTextModule,
      ButtonModule,
      FloatLabelModule,
   ],
   providers: [AuthenticationApiService, LocalStorageService],
   templateUrl: './login.component.html',
   styleUrl: './login.component.scss',
})
export class LoginComponent {
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

   constructor(
      private fb: FormBuilder,
      private authApiService: AuthenticationApiService,
      private localStorageService: LocalStorageService,
      private router: Router,
      private notifyService: ToastrService
   ) {}

   login() {
      if (this.form.invalid) {
         return;
      }

      const username = <string>this.form.get('username')!.value;
      const password = <string>this.form.get('password')!.value;

      this.authApiService.authenticate({ username, password }).subscribe({
         next: (response) => {
            this.router.navigate(['/']);
            this.localStorageService.save('Token', `Bearer ${response.token}`);
         },
         error: (err) => {
            this.notifyService.error(`Bad credentials`);
         },
      });
   }
}
