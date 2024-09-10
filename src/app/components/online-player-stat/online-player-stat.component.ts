import { Component } from '@angular/core';
import { OnlinePlayerStatApiService } from '../../core/api/onlinePlayerStatApi.service';
import { AsyncPipe, NgIf } from '@angular/common';

@Component({
   selector: 'app-online-player-stat',
   standalone: true,
   imports: [
      AsyncPipe,
      NgIf,
   ],
   providers: [OnlinePlayerStatApiService],
   templateUrl: './online-player-stat.component.html',
   styleUrl: './online-player-stat.component.scss',
})
export class OnlinePlayerStatComponent {
   $onlinePlayerStat = this.onlinePlayerStatApiService.listOnlinePlayersStat();

   constructor(private onlinePlayerStatApiService: OnlinePlayerStatApiService) {
   }
}
