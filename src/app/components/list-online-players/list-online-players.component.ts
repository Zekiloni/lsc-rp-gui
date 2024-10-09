import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { OnlinePlayersApiService } from '../../core/api/onlinePlayersApi.service';
import { OnlinePlayer } from '../../core/model/onlinePlayer';
import { AsyncPipe } from '@angular/common';
import { getSkinImage } from '../../core/util';
import { TooltipModule } from 'primeng/tooltip';
import { getAdministratorColor } from '../../core/util/account.util';

@Component({
   selector: 'app-list-online-players',
   standalone: true,
   imports: [
      AsyncPipe,
      TooltipModule,
   ],
   providers: [OnlinePlayersApiService],
   templateUrl: './list-online-players.component.html',
   styleUrl: './list-online-players.component.scss',
})
export class ListOnlinePlayersComponent {

   $onlinePlayers: Observable<OnlinePlayer[]>;

   constructor(private onlinePlayersApiService: OnlinePlayersApiService) {
      this.$onlinePlayers = this.onlinePlayersApiService.listOnlinePlayers();
   }

   protected readonly getSkinImage = getSkinImage;
   protected readonly getAdministratorColor = getAdministratorColor;
}
