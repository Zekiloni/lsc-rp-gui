import { Observable } from 'rxjs';
import { Component } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ChipsModule } from 'primeng/chips';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { DividerModule } from 'primeng/divider';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogService } from 'primeng/dynamicdialog';
import { Character } from '../../core/model/character';
import { getSkinImage } from '../../core/util';
import { AccountApiService } from '../../core/api/accountApi.service';
import { CharacterApiService } from '../../core/api/characterApi.service';
import { SkinSelectorModalComponent } from '../../components/skin-selector';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ApiError } from '../../core/model/apiError';

@Component({
   selector: 'app-character-settings-page',
   standalone: true,
   imports: [
      AsyncPipe,
      ChipsModule,
      DividerModule,
      CheckboxModule,
      ButtonModule,
      RippleModule,
      CalendarModule,
      FormsModule,
      DatePipe,
      ConfirmPopupModule,
   ],
   providers: [AccountApiService, CharacterApiService, ConfirmationService, DialogService],
   templateUrl: './character-settings-page.component.html',
   styleUrl: './character-settings-page.component.scss',
})
export class CharacterSettingsPageComponent {
   protected readonly getSkinImage = getSkinImage;

   $character !: Observable<Character>;

   constructor(
      private accountApiService: AccountApiService,
      private characterApiService: CharacterApiService,
      private confirmationService: ConfirmationService,
      private messageService: MessageService,
      private route: ActivatedRoute,
      private router: Router,
      private dialogService: DialogService) {

      this.retrieveCharacter();
   }

   retrieveCharacter() {
      this.$character = this.characterApiService.retrieveCharacter(this.route.snapshot.params['id']);
   }

   toggleSkinSelector(character: Character) {
      const skinSelectDialogRef = this.dialogService.open(SkinSelectorModalComponent, {
         header: 'Odaberite skin',
         width: '50%',
      });

      this.accountApiService.retrieveAccount(character.accountId)
         .subscribe({
            next: (account) => {
               if (account.isInGame) {
                  return this.messageService.add({
                     severity: 'error',
                     summary: 'Greška',
                     detail: 'Ne možete promeniti skin tokom igre.',
                  });
               }

               skinSelectDialogRef.onClose
                  .subscribe({
                     next: (selectedSkinId?: number) => this.handleSelectedSkin(character.id, selectedSkinId),
                  });
            },
         });
   }

   private handleSelectedSkin(characterId: number, selectedSkinId?: number) {
      if (selectedSkinId != undefined) {
         this.characterApiService.patchCharacter({ skin: selectedSkinId }, characterId)
            .subscribe({
               next: () => {
                  this.messageService.add({
                     severity: 'success',
                     summary: 'Uspešno',
                     detail: `Ažurirali ste skin na ${selectedSkinId}`,
                  });
                  this.retrieveCharacter();
               },
            });
      }
   }

   deleteCharacterConfirmation(event: Event, character: Character) {
      this.confirmationService.confirm({
         target: event.target as EventTarget,
         message: `Da li ste sigurni da želite izbrisati karaktera ${character.name}?`,
         icon: 'pi pi-info-trash',
         acceptLabel: 'Da',
         rejectLabel: 'Ne',
         acceptButtonStyleClass: 'p-button-danger p-button-sm',
         accept: () => {
            this.characterApiService.deleteCharacter(character.id)
               .subscribe({ next: () => this.handleCharacterDeleteResponse(character.name), error: this.handleCharacterDeleteError });
         },
      });
   }

   private handleCharacterDeleteResponse = (characterName: string) => {
      this.messageService.add({
         severity: 'success',
         summary: 'Uсpešno',
         detail: `Izbrisali ste karaktera ${characterName}`,
      });
      this.router.navigate(['ucp']);
   };

   private handleCharacterDeleteError = (error: ApiError) => {

   };
}
