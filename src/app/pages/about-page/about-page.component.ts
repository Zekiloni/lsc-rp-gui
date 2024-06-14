import { Component } from '@angular/core';
import { AnimateOnScrollModule } from 'primeng/animateonscroll';
import { HeroSectionComponent } from '../../components/home/hero-section/hero-section.component';

@Component({
  selector: 'app-about-page',
  standalone: true,
   imports: [
      AnimateOnScrollModule,
      HeroSectionComponent,
   ],
  templateUrl: './about-page.component.html',
  styleUrl: './about-page.component.scss'
})
export class AboutPageComponent {

}
