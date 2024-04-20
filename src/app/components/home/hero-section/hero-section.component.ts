import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { RouterLink } from '@angular/router';

@Component({
   selector: 'app-hero-section',
   standalone: true,
   imports: [
      ButtonModule,
      RippleModule,
      RouterLink,
   ],
   templateUrl: './hero-section.component.html',
   styleUrl: './hero-section.component.scss',
})
export class HeroSectionComponent {

}
