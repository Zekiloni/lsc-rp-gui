import { Component, inject, OnInit } from '@angular/core';
import { CharacterApiService } from '../../../core/api/characterApi.service';
import { AsyncPipe, DatePipe, NgForOf, NgIf } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';

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

   constructor(private characterApiService: CharacterApiService) {
   }

   updateCharaterPending(id: string) {
      console.log('RADIDIII');
   }

   acceptPlayer(characterElement: any) {
      console.log('PRIHVATI');
   }

   denyPlayer(characterElement: any) {
      console.log('ODBIJ');
   }
}
