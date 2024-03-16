import { vehicleNames } from '../core/constant/vehicle-names';

export const getVehicleImage = (modelId: number) => {
   return `./assets/images/vehicles/${modelId}.png`;
}

export const getVehicleName = (modelId: number) => {
   if (modelId < 400 || modelId > 611) {
      throw new Error("getVehicleName: invalid vehicle model id must be gte 400 and less than 611");
   }
   return vehicleNames[modelId - 400];
}