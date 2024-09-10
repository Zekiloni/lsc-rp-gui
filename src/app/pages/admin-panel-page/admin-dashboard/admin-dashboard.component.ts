import { Component } from '@angular/core';
import { OnlinePlayerStatComponent } from '../../../components/online-player-stat';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
   imports: [
      OnlinePlayerStatComponent,
   ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent {

}
