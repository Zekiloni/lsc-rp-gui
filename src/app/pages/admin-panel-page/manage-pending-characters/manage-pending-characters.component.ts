import { Component, inject, OnInit } from '@angular/core';
import { CharacterApiService } from '../../../core/api/characterApi.service';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-manage-pending-characters',
  standalone: true,
   imports: [
      NgIf,
      NgForOf,
      AsyncPipe,
   ],
   providers: [CharacterApiService],
  templateUrl: './manage-pending-characters.component.html',
  styleUrl: './manage-pending-characters.component.scss'
})
export class ManagePendingCharactersComponent {
   characterService = inject(CharacterApiService);
   pendingCharacters = this.characterService.listUnapprovedCharacter();
}
