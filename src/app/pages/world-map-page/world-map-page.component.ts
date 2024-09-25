import * as L from 'leaflet';
import { Component } from '@angular/core';
import { SaMapComponent } from '../../components/sa-map';
import { PropertyApiService } from '../../core/api/api';
import { Property, PropertyType } from '../../core/model/models';
import { BUSINESS_ICON, gameToMapCoords, HOUSE_FOR_SALE_ICON, HOUSE_ICON } from '../../core/util/map.util';

type PropertyLocation = (Property & { marker?: L.Marker });

@Component({
   selector: 'app-world-map-page',
   standalone: true,
   imports: [
      SaMapComponent,
   ],
   providers: [PropertyApiService],
   templateUrl: './world-map-page.component.html',
   styleUrl: './world-map-page.component.scss',
})
export class WorldMapPageComponent {
   properties: PropertyLocation[] = [];

   map: L.Map | undefined;

   constructor(private propertyApiService: PropertyApiService) {
   }

   handleMapCreated(map: L.Map) {
      this.map = map;
      this.propertyApiService.listProperties()
         .subscribe(this.handleListPropertiesResponse);
   }

   private handleListPropertiesResponse = (response: Property[]) => {
      response.forEach(this.showPropertyOnMap);
   };

   private convertToMapCoords(x: number, y: number) {
      const mapCoords = gameToMapCoords(x, y);
      return [mapCoords.y, mapCoords.x];
   }

   private showPropertyOnMap = (property: Property) => {
      if (property.exteriorVirtualWorld || (property.address && property.address.toLowerCase().includes("apartment"))) {
         return;
      }

      const [lat, lng] = this.convertToMapCoords(property.positionX, property.positionY);
      let marker: L.Marker | undefined;
      if (this.map) {
         switch (property.type) {
            case PropertyType.BUSINESS: {
               marker = L.marker([lat, lng], { icon: BUSINESS_ICON(property.bizType!, property.name) })
                  .addTo(this.map)
                  .bindTooltip(`${property.name}`)
                  .on('click', (e) => this.clickOnPropertyMarker(e, property.id!));
               break;
            }

            case PropertyType.HOUSE: {
               marker = L.marker([lat, lng], { icon: property.owner ? HOUSE_ICON : HOUSE_FOR_SALE_ICON })
                  .addTo(this.map)
                  .bindTooltip(`${property.address} #${property.id}`)
                  .on('click', (e) => this.clickOnPropertyMarker(e, property.id!));
               break;
            }
         }
      }

      this.properties.push({ ...property, marker });
   };

   private clickOnPropertyMarker = (e: L.LeafletMouseEvent, propertyId: number) => {
      const property = this.properties
         .find(({ id }) => id === propertyId);

      if (property) {
         console.log(property);
      }
   };
}
