import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { getSkinImage } from '../../util/character.util';
import { forbiddenSkins, sampSkins } from '../../core/constant/samp-skins';

@Component({
   selector: 'app-skin-selector-modal',
   standalone: true,
   imports: [
      NgOptimizedImage,
   ],
   templateUrl: './skin-selector-modal.component.html',
   styleUrl: './skin-selector-modal.component.scss',
})
export class SkinSelectorModalComponent {
   availableSkins = sampSkins
      .filter(skinId => !forbiddenSkins.includes(skinId));

   constructor(
      public ref: DynamicDialogRef
   ) {
   }

   selectSkin(skinId: number) {
      this.ref.close(skinId);
   }

   protected readonly getSkinImage = getSkinImage;
}
