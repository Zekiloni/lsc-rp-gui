export * from './accountApi.service';
import { AccountApiService } from './accountApi.service';
export * from './authenticationApi.service';
import { AuthenticationApiService } from './authenticationApi.service';
export * from './characterApi.service';
import { CharacterApiService } from './characterApi.service';
export * from './vehicleApi.service';
import { VehicleApiService } from './vehicleApi.service';
export const APIS = [AccountApiService, AuthenticationApiService, CharacterApiService, VehicleApiService];
