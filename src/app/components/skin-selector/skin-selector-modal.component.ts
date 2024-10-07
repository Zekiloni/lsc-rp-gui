import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { getSkinImage } from '../../core/util';
import { forbiddenSkins, sampSkins } from '../../core/constant/samp-skins';
import { SkinPreviewComponent } from '../skin-preview/skin-preview.component';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';

@Component({
   selector: 'app-skin-selector-modal',
   standalone: true,
   imports: [
      NgOptimizedImage,
      SkinPreviewComponent,
      PaginatorModule,
   ],
   templateUrl: './skin-selector-modal.component.html',
   styleUrl: './skin-selector-modal.component.scss',
})
export class SkinSelectorModalComponent {
   page = 0;
   pageSize = 10;

   protected readonly getSkinImage = getSkinImage;

   availableSkins = sampSkins
      .filter(skinId => !forbiddenSkins.includes(skinId));

   constructor(
      public ref: DynamicDialogRef
   ) {
   }

   selectSkin(skinId: number) {
      this.ref.close(skinId);
   }

   get paginatedSkins() {
      const start = this.page * this.pageSize;
      const end = start + this.pageSize;
      return this.availableSkins.slice(start, end);
   }

   onPageChange(event: PaginatorState) {
      this.page = event.page!;
   }
}
