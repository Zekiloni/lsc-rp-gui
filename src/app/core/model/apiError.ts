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

/**
 * Used when an API throws an Error, typically with a HTTP error response-code (3xx, 4xx, 5xx) 
 */
export interface ApiError { 
    /**
     * Application relevant detail, defined in the API or a common list.
     */
    code: string;
    /**
     * Explanation of the reason for the error which can be shown to a client user.
     */
    reason: string;
    /**
     * More details and corrective actions related to the error which can be shown to a client user.
     */
    message?: string;
    /**
     * HTTP Error code extension
     */
    status?: string;
    /**
     * URI of documentation describing the error.
     */
    referenceError?: string;
    /**
     * When sub-classing, this defines the sub-class entity name.
     */
    type?: string;
}