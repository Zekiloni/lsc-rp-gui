import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'app-start-playing',
  standalone: true,
   imports: [
      ButtonModule,
      RippleModule,
   ],
  templateUrl: './start-playing.component.html',
  styleUrl: './start-playing.component.scss'
})
export class StartPlayingComponent {
  open(url:string) {
    window.open(url);
  }
}
