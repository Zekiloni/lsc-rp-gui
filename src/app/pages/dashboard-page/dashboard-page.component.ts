import { Component, Inject } from '@angular/core';
import { CharactersCardsComponent } from '../../components/characters-cards';
import { TabViewModule } from 'primeng/tabview';
import { BansTableComponent } from '../../components/admin-record/bans-table';
import { selectAccount } from '../../stores/account/account.selector';
import { Store } from '@ngrx/store';
import { AsyncPipe, NgIf } from '@angular/common';

@Component({
   selector: 'app-dashboard-page',
   standalone: true,
   imports: [
      CharactersCardsComponent,
      TabViewModule,
      BansTableComponent,
      AsyncPipe,
      NgIf,
   ],
   templateUrl: './dashboard-page.component.html',
   styleUrl: './dashboard-page.component.scss',
})
export class DashboardPageComponent {
   userAccount$ = this.store.select(selectAccount);

   constructor(@Inject(Store) private store: Store) {
   }
}
