import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { CardModule } from 'primeng/card';

import { RegisterComponent } from './register/register.component';

@Component({
   selector: 'app-auth-page',
   standalone: true,
   imports: [CardModule, RegisterComponent],
   templateUrl: './auth-page.component.html',
   styleUrl: './auth-page.component.scss',
})
export class AuthPageComponent {
   constructor(private fb: FormBuilder) {}
}
