import { Component, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError, of, throwError } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DividerModule } from 'primeng/divider';
import { PaginatorModule } from 'primeng/paginator';
import { CalendarModule } from 'primeng/calendar';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CharacterApiService } from '../../core/api/api';
import { ApiError, CharacterCreate, CharacterGender } from '../../core/model/models';
import { getSkinImage } from '../../util/character.util';

import { SkinSelectorModalComponent } from '../../components/skin-selector';
import { SelectButtonModule } from 'primeng/selectbutton';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectAccount } from '../../stores/account/account.selector';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

const [CHARACTER_MIN_AGE, CHARACTER_MAX_AGE] = [18, 90];

@Component({
   selector: 'app-create-character-page',
   standalone: true,
   imports: [
      ButtonModule,
      RippleModule,
      InputTextModule,
      InputTextareaModule,
      DividerModule,
      PaginatorModule,
      ReactiveFormsModule,
      CalendarModule,
      SelectButtonModule,
      ToastModule,
   ],
   providers: [CharacterApiService, DialogService, MessageService],
   templateUrl: './create-character-page.component.html',
   styleUrl: './create-character-page.component.scss',
})
export class CreateCharacterPageComponent {
   protected readonly getSkinImage = getSkinImage;

   skinSelectDialogRef: DynamicDialogRef | undefined;

   genderOptions = [{ label: 'Muško', value: CharacterGender.MALE }, {
      label: 'Žensko',
      value: CharacterGender.FEMALE,
   }];

   form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(24)]],
      gender: [CharacterGender.MALE, [Validators.required]],
      birthday: ['', Validators.required, this.validateCharacterAge],
   });

   selectedSkin: number = 0;

   constructor(
      private fb: FormBuilder,
      private dialogService: DialogService,
      private characterApiService: CharacterApiService,
      private router: Router,
      @Inject(Store) private store: Store,
      private messageService: MessageService,
   ) {
   }

   validateCharacterAge(control: AbstractControl) {
      if (!control.value) {
         return of(null);
      }

      const birthDate: Date = new Date(control.value);
      const currentDate: Date = new Date();
      const age: number = currentDate.getFullYear() - birthDate.getFullYear();

      if (age < CHARACTER_MIN_AGE || age > CHARACTER_MAX_AGE) {
         return of({ 'characterAge': true });
      }

      return of(null);
   };

   toggleSkinSelector() {
      this.skinSelectDialogRef = this.dialogService.open(SkinSelectorModalComponent, {
         header: 'Odaberite skin',
         width: '50%',
      });

      this.skinSelectDialogRef.onClose.subscribe({
         next: (selectedSkinId) => {
            if (selectedSkinId >= 0) {
               this.selectedSkin = selectedSkinId;
            }
         },
      });
   }

   submitCharacterCreate() {
      if (this.form.invalid) {
         for (const name of Object.keys(this.form.controls) as (keyof typeof this.form.controls)[]) {
            if (this.form.controls[name].invalid) {
               console.log(name, 'is invalid');
            }
         }
         return;
      }

      this.store.select(selectAccount).subscribe({
         next: (account) => {
            if (!account) {
               return;
            }

            const characterCreate: CharacterCreate = {
               name: this.form.get('name')!.value!,
               birthday: this.form.get('birthday')!.value!,
               gender: this.form.get('gender')!.value!,
               skin: this.selectedSkin,
               accountId: account.id,
            };

            console.log(characterCreate);

            this.characterApiService.createCharacter(characterCreate)
               .pipe(catchError(error => throwError(() => error.error)))
               .subscribe({
                  next: (character) => {
                     this.router.navigate(['character', character.id]);
                  },
                  error: (error: ApiError) => {
                     console.log(error)
                     this.messageService.add({ severity: 'error', detail: error.message })
                  },
               });
         },
      });


   }
}
