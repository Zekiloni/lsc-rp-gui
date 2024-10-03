import { Component } from '@angular/core';
import { ListOnlinePlayersComponent } from '../../components/list-online-players';
@Component({
  selector: 'app-server-page',
  standalone: true,
  imports: [
    ListOnlinePlayersComponent,
  ],
  templateUrl: './server-page.component.html',
  styleUrl: './server-page.component.scss'
})
export class ServerPageComponent {

}
