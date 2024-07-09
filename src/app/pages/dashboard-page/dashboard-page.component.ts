import { Component, Inject } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { Store } from '@ngrx/store';
import { AsyncPipe, NgIf } from '@angular/common';
import { selectAccount } from '../../stores/account/account.selector';
import { CharactersCardsComponent } from '../../components/characters-cards';
import { BansTableComponent } from '../../components/admin-record/bans-table';
import { KicksTableComponent } from '../../components/admin-record/kicks-table';
import { WarnsTableComponent } from '../../components/admin-record/warns-table';

@Component({
   selector: 'app-dashboard-page',
   standalone: true,
   imports: [
      CharactersCardsComponent,
      TabViewModule,
      BansTableComponent,
      AsyncPipe,
      NgIf,
      KicksTableComponent,
      WarnsTableComponent,
   ],
   templateUrl: './dashboard-page.component.html',
   styleUrl: './dashboard-page.component.scss',
})
export class DashboardPageComponent {
   userAccount$ = this.store.select(selectAccount);

   constructor(@Inject(Store) private store: Store) {
   }

}
