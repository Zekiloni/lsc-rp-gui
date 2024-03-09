export * from './accountApi.service';
import { AccountApiService } from './accountApi.service';
export * from './authenticationApi.service';
import { AuthenticationApiService } from './authenticationApi.service';
export const APIS = [AccountApiService, AuthenticationApiService];
