import { Injectable, Optional } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Configuration } from '../configuration';
import { environment } from '../../../environments/environment';


export interface DiscordServerInfo {
   id: string
   name: string
   instant_invite: string
   channels: DiscordChannel[]
   members: DiscordMember[]
   presence_count: number
}

export interface DiscordChannel {
   id: string
   name: string
   position: number
}

export interface DiscordMember {
   id: string
   username: string
   discriminator: string
   avatar: any
   status: string
   avatar_url: string
   game?: Game
}

export interface Game {
   name: string
}

@Injectable()
export class DiscordApiService {

   public configuration = new Configuration();

   constructor(protected httpClient: HttpClient, @Optional() configuration: Configuration) {
      if (configuration) {
         this.configuration = configuration;
      }
   }

   getDiscordServer() {
      return this.httpClient.get<DiscordServerInfo>(environment.discordWidgetApi);
   }
}