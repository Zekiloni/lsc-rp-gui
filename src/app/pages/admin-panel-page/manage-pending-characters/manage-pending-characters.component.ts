import { Component } from '@angular/core';
import { CharacterApiService } from '../../../core/api/characterApi.service';
import { AsyncPipe, DatePipe, NgForOf, NgIf } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { Character } from '../../../core/model/character';
import { MessageService } from 'primeng/api';

@Component({
   selector: 'app-manage-pending-characters',
   standalone: true,
   imports: [
      NgIf,
      NgForOf,
      AsyncPipe,
      TableModule,
      ButtonModule,
      DatePipe,
   ],
   providers: [CharacterApiService],
   templateUrl: './manage-pending-characters.component.html',
   styleUrl: './manage-pending-characters.component.scss',
})
export class ManagePendingCharactersComponent {
   $pendingCharacters = this.characterApiService.listUnapprovedCharacter();

   constructor(
      private characterApiService: CharacterApiService,
      private messageService: MessageService,
   ) {
   }

   resolveCharacterApplication(character: Character, approved: boolean) {
      this.characterApiService.patchCharacter({ isApproved: approved }, character.id)
         .subscribe({
            next: this.handleResolveCharacterApplication,
         });
   }

   private handleResolveCharacterApplication = (response: Character) => {
      this.$pendingCharacters = this.characterApiService.listUnapprovedCharacter();
      this.messageService.add({
         severity: 'success',
         summary: 'Aplikacija je rešena',
         detail: `${response.isApproved ? 'Prihvatili' : 'Odbili'} ste aplikaciju ${response.name}`,
      });
   };
}
