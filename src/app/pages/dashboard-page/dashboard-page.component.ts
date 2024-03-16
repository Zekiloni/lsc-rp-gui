import { Component, Inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectAccount } from '../../stores/account/account.selector';
import { DatePipe, NgOptimizedImage } from '@angular/common';
import { Character } from '../../core/model/character';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@Component({
   selector: 'app-dashboard-page',
   standalone: true,
   imports: [
      NgOptimizedImage,
      CardModule,
      ButtonModule,
      DatePipe,
   ],
   templateUrl: './dashboard-page.component.html',
   styleUrl: './dashboard-page.component.scss',
})
export class DashboardPageComponent implements OnInit {
   characters: Character[] | undefined;

   constructor(@Inject(Store) private store: Store) {
   }

   getSkinImage(skinId: number) {
      return `./assets/images/skins/skin-${skinId}_top.png`;
   }

   ngOnInit(): void {
      this.store.select(selectAccount).subscribe(({
         next: (account) => {
            this.characters = account!.characters;
         }
      }))
   }
}
