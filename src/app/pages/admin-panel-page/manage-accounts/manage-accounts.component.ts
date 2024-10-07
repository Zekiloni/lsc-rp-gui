import { AfterViewInit, Component } from '@angular/core';
import { AccountApiService } from '../../../core/api/api';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Account } from '../../../core/model/account';
import { MessageService } from 'primeng/api';
import { ApiError } from '../../../core/model/apiError';
import { TableLazyLoadEvent, TableModule, TablePageEvent } from 'primeng/table';
import { AsyncPipe, DatePipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { Observable } from 'rxjs';

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
      AsyncPipe,
   ],
   providers: [AccountApiService],
   templateUrl: './manage-accounts.component.html',
   styleUrl: './manage-accounts.component.scss',
})
export class ManageAccountsComponent {
   accounts: Account[] = [];
   totalAccounts = 0;
   offset = 0;
   limit = 10;

   filterAccountForm: FormGroup = this.formBuilder.group({
      username: [''],
      emailAddress: [''],
   });

   constructor(private accountApiService: AccountApiService,
               private formBuilder: FormBuilder) {
      this.retrieveAccounts();
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

   submitAccountFilterForm() {
      this.retrieveAccounts();
   }

   private retrieveAccounts() {
      const { username, emailAddress } = this.accountFilterQuery;
      this.accountApiService.listAccount(this.offset, this.limit, username, emailAddress, 'response')
         .subscribe({
            next: (response) => {
               this.accounts = response.body as Account[];
               console.log(response)
               this.totalAccounts = parseInt(response.headers.get('X-Total-Count')!);
            },
         });
   }

   onLazyLoad(event: TableLazyLoadEvent) {
      console.log('onPage')
      const pageNumber = (event.first === 0 || event.first == undefined) ? 0 : event.first / (event.rows == undefined ? 1 : event.rows) + 1;
      this.limit = event.rows == undefined ? 10 : event.rows;
      this.offset = pageNumber;
      console.log('aa')
      this.retrieveAccounts();
   }
}
