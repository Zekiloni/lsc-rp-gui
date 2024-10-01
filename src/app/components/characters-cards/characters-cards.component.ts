import { Component, Inject, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DatePipe, NgOptimizedImage } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectAccount } from '../../stores/account/account.selector';
import { Character } from '../../core/model/models';
import { RippleModule } from 'primeng/ripple';
import { beautifyName, getSkinImage } from '../../core/util';
import { getCharacterStatusClass, getCharacterStatusLabel } from '../../core/util';

@Component({
   selector: 'app-characters-cards',
   standalone: true,
   imports: [
      NgOptimizedImage,
      CardModule,
      ButtonModule,
      DatePipe,
      RouterLink,
      RippleModule,
   ],
   templateUrl: './characters-cards.component.html',
   styleUrl: './characters-cards.component.scss',
})
export class CharactersCardsComponent implements OnInit {
   protected readonly getSkinImage = getSkinImage;
   protected readonly beautifyName = beautifyName;

   characterSlots: number[] = [0, 1, 2];

   characters: Character[] | undefined;

   constructor(@Inject(Store) private store: Store, private router: Router) {
   }

   isSlotAvailable(slot: number) {
      return !this.characters![slot];
   }

   getCharacter(slot: number) {
      return this.characters![slot];
   }

   ngOnInit(): void {
      this.store.select(selectAccount).subscribe(({
         next: (account) => {
            if (!account) return;
            this.characters = account!.characters || [];
         },
      }));
   }

   viewCharacter(id: number) {
      this.router.navigate(['character', id]);
   }

   createCharacter() {
      this.router.navigate(['create-character']);
   }


   protected readonly getCharacterStatusClass = getCharacterStatusClass;
   protected readonly getCharacterStatusLabel = getCharacterStatusLabel;
}
