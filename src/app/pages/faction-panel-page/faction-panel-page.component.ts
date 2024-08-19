import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { filter, map } from 'rxjs';
import { Character, Faction } from '../../core/model/models';
import { CharacterApiService, FactionApiService } from '../../core/api/api';
import { MembersViewTableComponent } from '../../components/faction/members-view-table';
import { formatCurrency } from '../../util/currency.util';
import { Store } from '@ngrx/store';
import { selectAccount } from '../../stores/account/account.selector';

@Component({
   selector: 'app-faction-panel-page',
   standalone: true,
   imports: [
      PanelModule,
      TableModule,
      InputTextModule,
      MembersViewTableComponent,
   ],
   providers: [FactionApiService, CharacterApiService],
   templateUrl: './faction-panel-page.component.html',
   styleUrl: './faction-panel-page.component.scss',
})
export class FactionPanelPageComponent implements OnInit {
   protected readonly formatCurrency = formatCurrency;

   faction: Faction | undefined;
   showMembersActions: boolean = false;

   constructor(private route: ActivatedRoute,
               private characterApiService: CharacterApiService,
               private factionApiService: FactionApiService,
               private router: Router,
               @Inject(Store) private readonly store: Store,
               private messageService: MessageService) {
   }

   ngOnInit(): void {
      const characterId = this.route.snapshot.params['id'] as number;

      this.characterApiService.retrieveCharacter(characterId)
         .pipe(
            filter(character => character.factionId != 0),
         )
         .subscribe({
            next: (character) => {
               this.handleGetFaction(character);
            },
         });
   }

   private handleGetFaction(character: Character) {
      if (character.factionId) {
         this.factionApiService.retrieveFaction(character.factionId).subscribe({
            next: (faction) => {
               if (faction) {
                  this.faction = faction;

                  this.store.select(selectAccount)
                     .subscribe({
                        next: (account) => {
                           if ((account && account.admin >= 3) || (character.factionId == faction.id && character.isLeader)) {
                              this.showMembersActions = true;
                           }
                        },
                     });
               }
            },
         });
      } else {
         this.router.navigate(['character', character.id]);
         this.messageService.add({ severity: 'error', summary: 'Karakter nije pripadnik niti jedne fakcije' });
      }
   }
}
