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

export interface CharacterUpdate { 
    name?: string;
    health?: number;
    skin?: number;
    armour?: number;
    isApproved?: boolean;
    approvedBy?: string;
    deniedReason?: string;
    approvedAt?: Date;
}