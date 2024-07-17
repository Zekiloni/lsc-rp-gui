import { Component, EventEmitter, Output } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';

import { AccountCreate } from '../../../core/model/models';
import { ToastModule } from 'primeng/toast';
import { MenuItem, MessageService } from 'primeng/api';
import { StepsModule } from 'primeng/steps';
import { RoleplayQuizComponent } from '../../roleplay-quiz';

@Component({
   selector: 'app-register',
   standalone: true,
   imports: [
      ReactiveFormsModule,
      InputTextModule,
      ButtonModule,
      FloatLabelModule,
      ToastModule,
      StepsModule,
      RoleplayQuizComponent,
   ],
   templateUrl: './register.component.html',
   styleUrl: './register.component.scss',
})
export class RegisterComponent {
   @Output() onSubmitCreateAccount = new EventEmitter<AccountCreate>();

   quizStarted: boolean = false;

   activeStep: number = 0;
   registerSteps: MenuItem[] = [
      { label: 'Roleplay kviz' }, { label: 'Kreiranje računa' },
   ];

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
         return this.messageService.add({
            severity: 'error',
            summary: 'Greška',
            detail: 'Ispunite sva polja',
         });
      }

      if (this.form.get('password')!.value != this.form.get('confirmPassword')!.value) {
         return this.messageService.add({
            severity: 'error',
            summary: 'Greška',
            detail: 'Korisničke šifre se ne podudaraju',
         });
      }

      const accountCreate: AccountCreate = {
         username: this.form.get('username')!.value as string,
         email: this.form.get('email')!.value as string,
         password: this.form.get('password')!.value as string,
      };

      this.onSubmitCreateAccount.emit(accountCreate);
   }

   handleTestResponse(success: boolean) {
      if (success) {
         this.messageService.add({
            severity: 'success',
            summary: 'Uspešno',
            detail: 'Čestitamo, prošli ste roleplay quiz',
         });
         this.activeStep = 1;
      }
   }

   startQuiz() {
      this.quizStarted = true;
   }
}
