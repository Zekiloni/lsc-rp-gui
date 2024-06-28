import { Component, Input, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { LatLngTuple } from 'leaflet';

@Component({
   selector: 'app-sa-map',
   standalone: true,
   imports: [],
   templateUrl: './sa-map.component.html',
   styleUrl: './sa-map.component.scss',
})
export class SaMapComponent implements OnInit {
   @Input() width: string = '400px';
   @Input() height: string = '400px';

   private static mapExtent = [1022.5, 1022.5, 1022.5, 1022.5];
   private static mapZoom = { min: 0, max: 3 };
   private static mapMaxResolution = 1;
   private static mapMinResolution = Math.pow(2, SaMapComponent.mapZoom.max) * SaMapComponent.mapMaxResolution;

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
         maxZoom: SaMapComponent.mapZoom.max,
         minZoom: SaMapComponent.mapZoom.min,
         crs: this.crs,
      });

      this.layer = L.tileLayer('assets/images/tiles/sat.{z}.{x}.{y}.png', {
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
   }

   ngOnInit(): void {
      this.initializeMap();
   }

   mirrorNumbers(min: number, max: number, num: number) {
      let j = (max - num) - (num - min);
      return num + j;
   }

   reverseMirrorNumbers(min: number, max: number, mirroredNum: number) {
      return (max + min - mirroredNum);
   }

   private gameToMapCoords(x: number, y: number) {
      const mapSideLength = 2045.0;
      const topLeftX = -2990.0;
      const topLeftY = 3000.0;

      x = this.mirrorNumbers(0.0, mapSideLength, (x / topLeftX) * mapSideLength) / 2.0;
      y = this.mirrorNumbers(0.0, mapSideLength, (y / topLeftY) * mapSideLength) / 2.0;

      return { x, y };
   }

   mapToGameCoords(mapX: number, mapY: number) {
      const mapSideLength = 2045.0;
      const topLeftX = -2990.0;
      const topLeftY = 3000.0;

      let x = mapX * 2.0;
      let y = mapY * 2.0;

      x = this.reverseMirrorNumbers(0.0, mapSideLength, x);
      y = this.reverseMirrorNumbers(0.0, mapSideLength, y);

      x = (x / mapSideLength) * topLeftX;
      y = (y / mapSideLength) * topLeftY;

      return { x, y };
   }

   addToMap(x: number, y: number) {
      const mapCoords = this.gameToMapCoords(x, y);
      x = mapCoords.x;
      y = mapCoords.y;

      L.marker([y, x]).addTo(this.map!);
   }
}
