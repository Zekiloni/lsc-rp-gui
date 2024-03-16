/**
 * County RP API
 * API
 *
 * OpenAPI spec version: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import { Character } from './character';

export interface Account { 
    id: number;
    username: string;
    email: string;
    characters?: Array<Character>;
    lastLoginAt?: Date;
    updatedAt?: Date;
    admin: number;
    referralCode?: string;
    createdAt: Date;
}