import { Component } from '@angular/core';
import { CharactersCardsComponent } from '../../components/characters-cards/characters-cards.component';

@Component({
   selector: 'app-dashboard-page',
   standalone: true,
   imports: [
      CharactersCardsComponent,
   ],
   templateUrl: './dashboard-page.component.html',
   styleUrl: './dashboard-page.component.scss',
})
export class DashboardPageComponent {

}
