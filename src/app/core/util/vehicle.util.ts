import { vehicleNames } from '../constant/vehicle-names';
import { vehicleColors } from '../constant/vehicle-colors';

export const getVehicleImage = (modelId: number) => {
   return `../assets/images/vehicles/${modelId}.png`;
}

export const getVehicleName = (modelId: number) => {
   if (modelId < 400 || modelId > 611) {
      throw new Error("getVehicleName: invalid vehicle model id must be gte 400 and less than 611");
   }
   return vehicleNames[modelId - 400];
}

export const getVehicleHexColor = (color: number) => {
   return `#${vehicleColors[color]}`;
}