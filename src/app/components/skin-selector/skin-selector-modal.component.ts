import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { DynamicDialogComponent, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { getSkinImage } from '../../util/character.util';
import { sampSkins } from '../../core/constant/samp-skins';

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
   instance: DynamicDialogComponent | undefined;

   availableSkins = sampSkins;

   constructor(
      public ref: DynamicDialogRef,
      public config: DynamicDialogConfig,
   ) {
   }

   selectSkin(skinId: number) {
      this.ref.close(skinId);
   }

   protected readonly getSkinImage = getSkinImage;
}
