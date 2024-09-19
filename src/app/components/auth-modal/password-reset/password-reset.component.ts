import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PasswordResetApiService } from '../../../core/api/api';
import { MessageResponse, ApiError } from '../../../core/model/models';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
   selector: 'app-password-reset',
   standalone: true,
   imports: [
      ButtonModule,
      CheckboxModule,
      FloatLabelModule,
      InputTextModule,
      ReactiveFormsModule,
   ],
   providers: [PasswordResetApiService],
   templateUrl: './password-reset.component.html',
   styleUrl: './password-reset.component.scss',
})
export class PasswordResetComponent {
   private readonly _username = 'username';

   resetPasswordRequestForm !: FormGroup;

   isSubmitDisabled: boolean = false;

   constructor(
      public dialogRef: DynamicDialogRef,
      private formBuilder: FormBuilder,
      private messageService: MessageService,
      private passwordResetApiService: PasswordResetApiService) {

      this.resetPasswordRequestForm = this.buildResetPasswordRequestForm();
   }

   private buildResetPasswordRequestForm() {
      return this.formBuilder.group({
         username: ['', [Validators.required]],
      });
   }

   submitResetPasswordRequestForm() {
      if (this.resetPasswordRequestForm.invalid)
         return;

      this.isSubmitDisabled = true;

      const username = this.resetPasswordRequestForm.get(this._username)!.value;

      this.messageService.add({ severity: 'info', summary: 'Informacija', detail: 'Zahtev poslan, molimo sačekajte' });

      this.passwordResetApiService.createPasswordReset(username)
         .subscribe({
            next: this.handlePasswordResetRequestResponse,
            error: this.handlePasswordResetRequestErrorResponse,
         });
   }

   private handlePasswordResetRequestResponse = (response: MessageResponse) => {
      this.messageService.add({ severity: 'success', summary: 'Uspešno', detail: response.message });
      this.dialogRef.close();
   };

   private handlePasswordResetRequestErrorResponse = (response: ApiError) => {
      this.messageService.add({ severity: 'error', summary: 'Greška', detail: response.message });
      this.isSubmitDisabled = false;
   };
}
