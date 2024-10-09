import { Component, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Account } from '../../core/model/models';
import { getAdministratorColor, getAdministratorLabel } from '../../core/util/account.util';

@Component({
   selector: 'app-account-info',
   standalone: true,
   imports: [
      DatePipe,
   ],
   templateUrl: './account-info.component.html',
   styleUrl: './account-info.component.scss',
})
export class AccountInfoComponent {
   @Input() account !: Account;
   protected readonly getAdministratorLabel = getAdministratorLabel;
   protected readonly getAdministratorColor = getAdministratorColor;
}
