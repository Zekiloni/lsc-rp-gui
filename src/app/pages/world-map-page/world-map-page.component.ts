import { Component } from '@angular/core';
import { SaMapComponent } from '../../components/sa-map';

@Component({
  selector: 'app-world-map-page',
  standalone: true,
  imports: [
    SaMapComponent,
  ],
  templateUrl: './world-map-page.component.html',
  styleUrl: './world-map-page.component.scss'
})
export class WorldMapPageComponent {

}
