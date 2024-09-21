import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as L from 'leaflet';
import { LatLngTuple } from 'leaflet';
import { environment } from '../../../environments/environment';

@Component({
   selector: 'app-sa-map',
   standalone: true,
   imports: [],
   templateUrl: './sa-map.component.html',
   styleUrl: './sa-map.component.scss',
})
export class SaMapComponent implements OnInit {
   @Output() onMapCreated = new EventEmitter<L.Map>();

   private static mapExtent = [1022.5, 1022.5, 1022.5, 1022.5];
   private static mapZoom = { min: 0, max: 3 };
   private static mapMaxResolution = 1;
   private static mapMinResolution = Math.pow(2, SaMapComponent.mapZoom.max) * SaMapComponent.mapMaxResolution;

   private crs: L.CRS | undefined;
   map: L.Map | undefined;
   layer: L.Layer | undefined;

   initializeMap() {
      this.crs = L.extend({}, L.CRS.Simple, {
         transformation: new L.Transformation(1, 0, 1, 0),

         scale: function(zoom: number) {
            return Math.pow(2, zoom) / SaMapComponent.mapMinResolution;
         },

         zoom: function(scale: number) {
            return Math.log(scale * SaMapComponent.mapMinResolution) / Math.LN2;
         },
      });

      this.map = L.map('map', {
         maxZoom: SaMapComponent.mapZoom.max,
         minZoom: SaMapComponent.mapZoom.min,
         crs: this.crs,
      });

      this.layer = L.tileLayer(`${environment.staticUrl}/images/tiles-512/sat.{z}.{x}.{y}.png`, {
         minZoom: SaMapComponent.mapZoom.min,
         maxZoom: SaMapComponent.mapZoom.max,
         noWrap: true,
         tms: false,
      }).addTo(this.map);

      const element = document.getElementsByClassName('leaflet-control-attribution');
      (<HTMLElement>element[0]).style.display = 'none';

      this.map!.fitBounds([
         this.crs!.unproject(L.point(SaMapComponent.mapExtent[2], SaMapComponent.mapExtent[3])) as unknown as LatLngTuple,
         this.crs!.unproject(L.point(SaMapComponent.mapExtent[0], SaMapComponent.mapExtent[1])) as unknown as LatLngTuple,
      ]);

      // this.map!.fitBounds([
      //    [SaMapComponent.mapExtent[2], SaMapComponent.mapExtent[3]],
      //    [SaMapComponent.mapExtent[0], SaMapComponent.mapExtent[1]]
      // ])

      this.onMapCreated.emit(this.map);
   }

   ngOnInit(): void {
      this.initializeMap();
   }
}
