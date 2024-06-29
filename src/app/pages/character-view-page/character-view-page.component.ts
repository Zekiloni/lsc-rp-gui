import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe, JsonPipe, NgIf, NgOptimizedImage } from '@angular/common';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { TagModule } from 'primeng/tag';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';
import { beautifyName, getSkinImage } from '../../util/character.util';
import { getVehicleImage, getVehicleName } from '../../util/vehicle.util';
import { formatCurrency } from '../../util/currency.util';
import { CharacterApiService } from '../../core/api/characterApi.service';
import { Character } from '../../core/model/character';

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
      BreadcrumbModule,
   ],
   providers: [CharacterApiService],
   templateUrl: './character-view-page.component.html',
   styleUrl: './character-view-page.component.scss',
})
export class CharacterViewPageComponent implements OnInit {
   protected readonly getSkinImage = getSkinImage;
   protected readonly beautifyName = beautifyName;
   protected readonly formatCurrency = formatCurrency;

   protected readonly getVehicleName = getVehicleName;
   protected readonly getVehicleImage = getVehicleImage;

   character: Character | undefined;

   breadcrumbItems: MenuItem[] | undefined;

   back: MenuItem = { icon: 'pi pi-user', routerLink: '/ucp' };

   constructor(private characterApiService: CharacterApiService, private route: ActivatedRoute,
               private router: Router) {
   }

   ngOnInit(): void {
      const id = this.route.snapshot.params['id'];
      this.characterApiService.retrieveCharacter(id).subscribe({
         next: (character) => {
            this.character = character;
            this.breadcrumbItems = [
               {
                  label: 'Pregled karaktera ' + (character.name),
               },
            ];
         },
         error: (err) => {

            this.router.navigate(['/ucp']);
         },
      });
   }
}
