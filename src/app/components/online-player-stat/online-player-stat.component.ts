import { Component } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { OnlinePlayerStat } from '../../core/model/models';
import { OnlinePlayerStatApiService } from '../../core/api/api';

@Component({
   selector: 'app-online-player-stat',
   standalone: true,
   imports: [
      AsyncPipe,
      NgIf,
      ChartModule,
   ],
   providers: [OnlinePlayerStatApiService],
   templateUrl: './online-player-stat.component.html',
   styleUrl: './online-player-stat.component.scss',
})
export class OnlinePlayerStatComponent {
   $onlinePlayerStat = this.onlinePlayerStatApiService.listOnlinePlayersStat();

   constructor(private onlinePlayerStatApiService: OnlinePlayerStatApiService) {
   }

   transformToData(onlinePlayerStat: OnlinePlayerStat[]) {
      return {
         labels: onlinePlayerStat.map(data => new Date(data.createdAt).toLocaleTimeString()),
         datasets: [
            {
               label: 'Player Count',
               data: onlinePlayerStat.map(data => data.playerCount),
               fill: false,
               tension: 0.4,
               borderColor: '#42A5F5',
            },
         ],
      };
   }
}
