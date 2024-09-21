import * as L from 'leaflet';
import { environment } from '../../../environments/environment';
import { bizTypes } from '../constant/biz-types';
import { BizType } from '../model/bizType';

const DEFAULT_ICON_SIZE: [number, number] = [15, 15];

export const HOUSE_ICON = L.icon({
   iconUrl: `${environment.staticUrl}/images/map-icons/property.gif`,
   iconSize: DEFAULT_ICON_SIZE,
});

export const HOUSE_FOR_SALE_ICON = L.icon({
   iconUrl: `${environment.staticUrl}/images/map-icons/property_for_sale.gif`,
   iconSize: DEFAULT_ICON_SIZE,
});

const getBizIcon = (type: BizType, name?: string) => {
   switch (type) {
      case bizTypes.GROCERY_STORE: {
         return 'store.png';
      }

      case bizTypes.CLOTHING_STORE: {
         return `clothes.gif`;
      }

      case bizTypes.BAR: {
         return 'bar.gif';
      }

      case bizTypes.RESTAURANT: {
         switch (true) {
            case name && name.toLowerCase().includes("pizza"):
               return 'pizza.gif';

            case name && name.toLowerCase().includes("burger"):
               return 'burger.gif';

            default:
               return 'restaurant.gif';
         }
      }

      case bizTypes.GAS_STATION: {
         return 'fuel.png';
      }

      default:
         return `icon56.gif`;
   }
};

export const BUSINESS_ICON = (type: BizType, name?: string) => L.icon({
   iconUrl: `${environment.staticUrl}/images/map-icons/${getBizIcon(type, name)}`,
   iconSize: DEFAULT_ICON_SIZE,
});

const mirrorNumbers = (min: number, max: number, num: number) => {
   let j = (max - num) - (num - min);
   return num + j;
};

export const reverseMirrorNumbers = (min: number, max: number, mirroredNum: number) => {
   return (max + min - mirroredNum);
};

export const gameToMapCoords = (x: number, y: number) => {
   const mapSideLength = 2045.0;
   const topLeftX = -2990.0;
   const topLeftY = 3000.0;

   x = mirrorNumbers(0.0, mapSideLength, (x / topLeftX) * mapSideLength) / 2.0;
   y = mirrorNumbers(0.0, mapSideLength, (y / topLeftY) * mapSideLength) / 2.0;

   return { x, y };
};

export const mapToGameCoords = (mapX: number, mapY: number) => {
   const mapSideLength = 2045.0;
   const topLeftX = -2990.0;
   const topLeftY = 3000.0;

   let x = mapX * 2.0;
   let y = mapY * 2.0;

   x = reverseMirrorNumbers(0.0, mapSideLength, x);
   y = reverseMirrorNumbers(0.0, mapSideLength, y);

   x = (x / mapSideLength) * topLeftX;
   y = (y / mapSideLength) * topLeftY;

   return { x, y };
};