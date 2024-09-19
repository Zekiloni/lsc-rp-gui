import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PasswordResetApiService } from '../../core/api/api';
import { ResetPassword, MessageResponse, ApiError } from '../../core/model/models';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { LoginComponent, PASSWORD_VALIDATORS } from '../../components/auth-modal/login';
import { RegisterComponent } from '../../components/auth-modal/register';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';


@Component({
   selector: 'app-password-reset-page',
   standalone: true,
   imports: [
      ButtonModule,
      CardModule,
      LoginComponent,
      RegisterComponent,
      FloatLabelModule,
      InputTextModule,
      ReactiveFormsModule,
   ],
   providers: [PasswordResetApiService],
   templateUrl: './password-reset-page.component.html',
   styleUrl: './password-reset-page.component.scss',
})
export class PasswordResetPageComponent {
   private readonly REDIRECT_TO_AUTH_MS = 1000;

   private readonly _newPassword = 'newPassword';
   private readonly _confirmNewPassword = 'confirmNewPassword';

   passwordResetForm!: FormGroup;

   constructor(private route: ActivatedRoute,
               private formBuilder: FormBuilder,
               private router: Router,
               private messageService: MessageService,
               private passwordResetApiService: PasswordResetApiService) {

      this.passwordResetForm = this.buildPasswordResetForm();
   }

   private buildPasswordResetForm() {
      return this.formBuilder.group({
         newPassword: ['', PASSWORD_VALIDATORS],
         confirmNewPassword: ['', PASSWORD_VALIDATORS],
      }, {
         validators: [this.confirmPasswordValidator],
      });
   }

   get resetToken(): string | undefined {
      return this.route.snapshot.params['token'];
   }

   submitPasswordResetForm() {
      if (!this.resetToken || this.passwordResetForm.invalid) {
         return;
      }

      const passwordReset: ResetPassword = {
         newPassword: this.passwordResetForm.get(this._newPassword)!.value as string,
      };

      this.passwordResetApiService.handlePasswordReset(passwordReset, this.resetToken!)
         .subscribe({ next: this.handlePasswordResetResponse, error: this.handlePasswordResetErrorResponse });
   }
   private handlePasswordResetResponse = (response: MessageResponse) => {
      this.messageService.add({ summary: 'success', severity: 'Uspešno', detail: response.message });
      setTimeout(() => this.router.navigate(['auth']), this.REDIRECT_TO_AUTH_MS);
   };

   private confirmPasswordValidator = (formGroup: AbstractControl) => {
      return formGroup.get(this._newPassword)!.value === formGroup.get(this._confirmNewPassword)!.value ?
         null : { passwordsMismatch: true };
   };

   private handlePasswordResetErrorResponse = (response: ApiError) => {
      this.messageService.add({ severity: 'error', summary: 'Greška', detail: response.message });
   }
}
