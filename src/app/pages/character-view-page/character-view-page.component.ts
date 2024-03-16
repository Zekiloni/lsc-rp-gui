import { Component, OnInit } from '@angular/core';
import { CharacterApiService } from '../../core/api/characterApi.service';
import { Character } from '../../core/model/character';
import { ActivatedRoute } from '@angular/router';
import { DatePipe, JsonPipe, NgIf, NgOptimizedImage } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { TagModule } from 'primeng/tag';
import { beautifyName, getSkinImage } from '../../util/character.util';
import { formatCurrency } from '../../util/currency.util';
import { getVehicleImage, getVehicleName } from '../../util/vehicle.util';
import { OverlayPanelModule } from 'primeng/overlaypanel';

@Component({
   selector: 'app-character-view-page',
   standalone: true,
   imports: [
      JsonPipe,
      ButtonModule,
      RippleModule,
      TagModule,
      NgIf,
      DatePipe,
      OverlayPanelModule,
      NgOptimizedImage,
   ],
   providers: [CharacterApiService],
   templateUrl: './character-view-page.component.html',
   styleUrl: './character-view-page.component.scss',
})
export class CharacterViewPageComponent implements OnInit {
   protected readonly getSkinImage = getSkinImage;
   protected readonly beautifyName = beautifyName;
   protected readonly formatCurrency = formatCurrency;

   character: Character | undefined;

   constructor(private characterApiService: CharacterApiService, private route: ActivatedRoute) {
   }

   ngOnInit(): void {
      const id = this.route.snapshot.params['id'];
      this.characterApiService.retrieveCharacter(id).subscribe({
         next: (character) => {
            this.character = character;
         },
         error: (err) => console.log(err)
      })
   }

   protected readonly getVehicleName = getVehicleName;
   protected readonly getVehicleImage = getVehicleImage;
}
