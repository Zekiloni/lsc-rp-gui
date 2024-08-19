import { AfterViewInit, Component } from '@angular/core';
import { AccountApiService } from '../../../core/api/api';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Account } from '../../../core/model/account';
import { MessageService } from 'primeng/api';
import { ApiError } from '../../../core/model/apiError';
import { TableModule } from 'primeng/table';
import { DatePipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';

@Component({
   selector: 'app-manage-accounts',
   standalone: true,
   imports: [
      TableModule,
      DatePipe,
      ButtonModule,
      RadioButtonModule,
      ReactiveFormsModule,
      FloatLabelModule,
      InputTextModule,
   ],
   providers: [AccountApiService],
   templateUrl: './manage-accounts.component.html',
   styleUrl: './manage-accounts.component.scss',
})
export class ManageAccountsComponent implements AfterViewInit {
   accounts: Account[] = [];

   filterAccountForm: FormGroup = this.formBuilder.group({
      username: [''],
      emailAddress: [''],
   });

   constructor(private accountApiService: AccountApiService,
               private messageService: MessageService,
               private formBuilder: FormBuilder) {
   }

   get accountFilterQuery() {
      return {
         username: this.getFilterValue('username'),
         emailAddress: this.getFilterValue('emailAddress'),
      };
   }

   getFilterValue(key: string) {
      const value = this.filterAccountForm.get(key)!.value;
      return value && value.length > 0 ? value : undefined;
   }

   ngAfterViewInit() {
      this.fetchAccounts();
   }

   private fetchAccounts() {
      const { username, emailAddress } = this.accountFilterQuery;
      this.accountApiService.listAccount(username, emailAddress)
         .subscribe({
            next: (response) => {
               this.accounts = response;
            },
            error: (response: ApiError) => this.messageService.add({ severity: 'error', detail: response.message }),
         });
   }

   submitAccountFilterForm() {
      this.fetchAccounts();
   }
}
