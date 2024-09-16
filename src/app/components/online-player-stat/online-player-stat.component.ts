import { Component } from '@angular/core';
import { AsyncPipe, DatePipe, NgIf } from '@angular/common';
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
   providers: [OnlinePlayerStatApiService, DatePipe],
   templateUrl: './online-player-stat.component.html',
   styleUrl: './online-player-stat.component.scss',
})
export class OnlinePlayerStatComponent {
   $onlinePlayerStat = this.onlinePlayerStatApiService.listOnlinePlayersStat();

   constructor(private onlinePlayerStatApiService: OnlinePlayerStatApiService, private datePipe: DatePipe) {
   }

   transformToData(onlinePlayerStat: OnlinePlayerStat[]) {
      return {
         labels: onlinePlayerStat.map(data => this.datePipe.transform(data.createdAt, 'HH:mm:ss')),
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
