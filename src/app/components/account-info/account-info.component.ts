import { Component, Input } from '@angular/core';
import { Account } from '../../core/model/models';
import { DatePipe } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { getAdministratorLabel, getAdministratorSeverity } from '../../core/util/account.util';

@Component({
   selector: 'app-account-info',
   standalone: true,
   imports: [
      DatePipe,
      TagModule,
   ],
   templateUrl: './account-info.component.html',
   styleUrl: './account-info.component.scss',
})
export class AccountInfoComponent {
   @Input() account !: Account;
   protected readonly getAdministratorLabel = getAdministratorLabel;
   protected readonly getAdministratorSeverity = getAdministratorSeverity;
}
