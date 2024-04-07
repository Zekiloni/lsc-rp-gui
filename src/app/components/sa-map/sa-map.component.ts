import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
   selector: 'app-sa-map',
   standalone: true,
   imports: [],
   templateUrl: './sa-map.component.html',
   styleUrl: './sa-map.component.scss',
})
export class SaMapComponent implements OnInit {
   private static mapExtent = [1022.5, 1022.5, 1022.5, 1022.5];
   private static mapZoom = { min: 0, max: 3 };
   private static mapMaxResolution = 1;
   private static mapMinResolution = Math.pow(2, SaMapComponent.mapZoom.max) * SaMapComponent.mapMaxResolution;
   private static tileExtent = [0, 0, 0, 0];

   private crs: L.CRS | undefined;
   private map: L.Map | undefined;
   private layer: L.Layer | undefined;

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
         center: [0.0, 0.0],
         zoom: 1,
         maxZoom: SaMapComponent.mapZoom.max,
         minZoom: SaMapComponent.mapZoom.min,
         crs: this.crs,
      });

      this.layer = L.tileLayer('https://github.com/DeAardbolMan/SAMAP/tree/master/images/tiles/sat.{z}.{x}.{y}.png', {
         minZoom: SaMapComponent.mapZoom.min, maxZoom: SaMapComponent.mapZoom.max,
         noWrap: true,
         tms: false,
      }).addTo(this.map);

   }

   ngOnInit(): void {
      this.initializeMap();
   }
}
