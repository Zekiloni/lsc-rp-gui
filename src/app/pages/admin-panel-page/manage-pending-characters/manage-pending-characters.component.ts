import { Component, inject, OnInit } from '@angular/core';
import { CharacterApiService } from '../../../core/api/characterApi.service';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
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
   ],
   providers: [CharacterApiService],
   templateUrl: './manage-pending-characters.component.html',
   styleUrl: './manage-pending-characters.component.scss',
})
export class ManagePendingCharactersComponent {
   $pendingCharacters = this.characterApiService.listUnapprovedCharacter();

   constructor(private characterApiService: CharacterApiService) {
   }
}
