import { Component } from '@angular/core';
import { HeroSectionComponent } from '../../components/home/hero-section/hero-section.component';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { AnimateOnScrollModule } from 'primeng/animateonscroll';
import { FaqComponent } from '../../components/home/faq/faq.component';
import { StartPlayingComponent } from '../../components/start-playing/start-playing.component';

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
   ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {

}
