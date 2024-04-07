import { Component } from '@angular/core';
import { HeroSectionComponent } from '../../components/home/hero-section/hero-section.component';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { FaqComponent } from '../../components/home/faq/faq.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
   imports: [
      HeroSectionComponent,
      ButtonModule,
      RippleModule,
      FaqComponent,
   ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {

}
