import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { AnimateOnScrollModule } from 'primeng/animateonscroll';

import { HeroSectionComponent } from '../../components/home/hero-section';
import { FaqComponent } from '../../components/home/faq/faq.component';
import { StartPlayingComponent } from '../../components/start-playing';
import { SaMapComponent } from '../../components/sa-map';

@Component({
   selector: 'app-home-page',
   standalone: true,
   imports: [
      HeroSectionComponent,
      ButtonModule,
      RippleModule,
      FaqComponent,
      StartPlayingComponent,
      AnimateOnScrollModule,
      SaMapComponent,
   ],
   templateUrl: './home-page.component.html',
   styleUrl: './home-page.component.scss',
})
export class HomePageComponent {
}
