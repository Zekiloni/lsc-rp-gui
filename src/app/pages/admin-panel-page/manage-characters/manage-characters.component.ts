import { AfterViewInit, Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService, SharedModule } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { Router } from '@angular/router';
import { CharacterApiService } from '../../../core/api/api';
import { ApiError, Character } from '../../../core/model/models';

@Component({
   selector: 'app-manage-characters',
   standalone: true,
   imports: [
      ButtonModule,
      DatePipe,
      FormsModule,
      InputTextModule,
      ReactiveFormsModule,
      SharedModule,
      TableModule,
   ],
   providers: [CharacterApiService],
   templateUrl: './manage-characters.component.html',
   styleUrl: './manage-characters.component.scss',
})
export class ManageCharactersComponent implements AfterViewInit {
   characters: Character[] = [];

   filterCharacterForm: FormGroup = this.formBuilder.group({
      name: [''],
      accountUsername: [''],
   });

   constructor(
      private characterApiService: CharacterApiService,
      private messageService: MessageService,
      private formBuilder: FormBuilder,
      private router: Router) {
   }

   get characterFilterQuery() {
      return {
         name: this.getFilterValue('name'),
         accountUsername: this.getFilterValue('accountUsername'),
      };
   }

   getFilterValue(key: string) {
      const value = this.filterCharacterForm.get(key)!.value;
      return value && value.length > 0 ? value : undefined;
   }

   ngAfterViewInit() {
      this.fetchCharacters();
   }

   private fetchCharacters() {
      const { name, accountUsername } = this.characterFilterQuery;
      this.characterApiService.listCharacters(name, accountUsername)
         .subscribe({
            next: (response) => {
               this.characters = response;
            },
            error: (response: ApiError) => this.messageService.add({ severity: 'error', detail: response.message }),
         });
   }

   submitCharacterFilterForm() {
      this.fetchCharacters();
   }

   openSingleCharacter(character: Character) {
      this.router.navigate(['character', character.id]);
   }
}
