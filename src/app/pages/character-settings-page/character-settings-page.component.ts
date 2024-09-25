import { Observable } from 'rxjs';
import { Component } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ChipsModule } from 'primeng/chips';
import { MessageService } from 'primeng/api';
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
   ],
   providers: [AccountApiService, CharacterApiService, DialogService],
   templateUrl: './character-settings-page.component.html',
   styleUrl: './character-settings-page.component.scss',
})
export class CharacterSettingsPageComponent {
   protected readonly getSkinImage = getSkinImage;

   $character !: Observable<Character>;

   constructor(
      private accountApiService: AccountApiService,
      private characterApiService: CharacterApiService,
      private messageService: MessageService,
      private route: ActivatedRoute,
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
}
