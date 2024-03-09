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
 */ /* tslint:disable:no-unused-variable member-ordering */

import { Inject, Injectable, Optional } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpResponse,
  HttpEvent,
} from '@angular/common/http';

import { Observable } from 'rxjs';

import { Account } from '../model/account';
import { AccountCreate } from '../model/accountCreate';
import { AccountUpdate } from '../model/accountUpdate';

import { BASE_PATH, COLLECTION_FORMATS } from '../variables';
import { Configuration } from '../configuration';

@Injectable()
export class AccountApiService {
  protected basePath = '/';
  public defaultHeaders = new HttpHeaders();
  public configuration = new Configuration();

  constructor(
    protected httpClient: HttpClient,
    @Optional() @Inject(BASE_PATH) basePath: string,
    @Optional() configuration: Configuration
  ) {
    if (basePath) {
      this.basePath = basePath;
    }
    if (configuration) {
      this.configuration = configuration;
      this.basePath = basePath || configuration.basePath || this.basePath;
    }
  }

  /**
   * @param consumes string[] mime-types
   * @return true: consumes contains 'multipart/form-data', false: otherwise
   */
  private canConsumeForm(consumes: string[]): boolean {
    const form = 'multipart/form-data';
    for (const consume of consumes) {
      if (form === consume) {
        return true;
      }
    }
    return false;
  }

  /**
   * Create a new account
   *
   * @param body
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public createAccount(
    body: AccountCreate,
    observe?: 'body',
    reportProgress?: boolean
  ): Observable<Account>;
  public createAccount(
    body: AccountCreate,
    observe?: 'response',
    reportProgress?: boolean
  ): Observable<HttpResponse<Account>>;
  public createAccount(
    body: AccountCreate,
    observe?: 'events',
    reportProgress?: boolean
  ): Observable<HttpEvent<Account>>;
  public createAccount(
    body: AccountCreate,
    observe: any = 'body',
    reportProgress: boolean = false
  ): Observable<any> {
    if (body === null || body === undefined) {
      throw new Error(
        'Required parameter body was null or undefined when calling createAccount.'
      );
    }

    let headers = this.defaultHeaders;

    // to determine the Accept header
    let httpHeaderAccepts: string[] = ['application/json'];
    const httpHeaderAcceptSelected: string | undefined =
      this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected != undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    const consumes: string[] = ['application/json'];
    const httpContentTypeSelected: string | undefined =
      this.configuration.selectHeaderContentType(consumes);
    if (httpContentTypeSelected != undefined) {
      headers = headers.set('Content-Type', httpContentTypeSelected);
    }

    return this.httpClient.request<Account>(
      'post',
      `${this.basePath}/account`,
      {
        body: body,
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress,
      }
    );
  }

  /**
   * Delete an account by ID
   *
   * @param accountId
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public deleteAccount(
    accountId: number,
    observe?: 'body',
    reportProgress?: boolean
  ): Observable<any>;
  public deleteAccount(
    accountId: number,
    observe?: 'response',
    reportProgress?: boolean
  ): Observable<HttpResponse<any>>;
  public deleteAccount(
    accountId: number,
    observe?: 'events',
    reportProgress?: boolean
  ): Observable<HttpEvent<any>>;
  public deleteAccount(
    accountId: number,
    observe: any = 'body',
    reportProgress: boolean = false
  ): Observable<any> {
    if (accountId === null || accountId === undefined) {
      throw new Error(
        'Required parameter accountId was null or undefined when calling deleteAccount.'
      );
    }

    let headers = this.defaultHeaders;

    // to determine the Accept header
    let httpHeaderAccepts: string[] = [];
    const httpHeaderAcceptSelected: string | undefined =
      this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected != undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    const consumes: string[] = [];

    return this.httpClient.request<any>(
      'delete',
      `${this.basePath}/account/${encodeURIComponent(String(accountId))}`,
      {
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress,
      }
    );
  }

  /**
   * Get a list of all accounts
   *
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public listAccount(
    observe?: 'body',
    reportProgress?: boolean
  ): Observable<Array<Account>>;
  public listAccount(
    observe?: 'response',
    reportProgress?: boolean
  ): Observable<HttpResponse<Array<Account>>>;
  public listAccount(
    observe?: 'events',
    reportProgress?: boolean
  ): Observable<HttpEvent<Array<Account>>>;
  public listAccount(
    observe: any = 'body',
    reportProgress: boolean = false
  ): Observable<any> {
    let headers = this.defaultHeaders;

    // to determine the Accept header
    let httpHeaderAccepts: string[] = ['application/json'];
    const httpHeaderAcceptSelected: string | undefined =
      this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected != undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    const consumes: string[] = [];

    return this.httpClient.request<Array<Account>>(
      'get',
      `${this.basePath}/account`,
      {
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress,
      }
    );
  }

  /**
   * Update an account by ID
   *
   * @param body
   * @param accountId
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public patchAccount(
    body: AccountUpdate,
    accountId: number,
    observe?: 'body',
    reportProgress?: boolean
  ): Observable<any>;
  public patchAccount(
    body: AccountUpdate,
    accountId: number,
    observe?: 'response',
    reportProgress?: boolean
  ): Observable<HttpResponse<any>>;
  public patchAccount(
    body: AccountUpdate,
    accountId: number,
    observe?: 'events',
    reportProgress?: boolean
  ): Observable<HttpEvent<any>>;
  public patchAccount(
    body: AccountUpdate,
    accountId: number,
    observe: any = 'body',
    reportProgress: boolean = false
  ): Observable<any> {
    if (body === null || body === undefined) {
      throw new Error(
        'Required parameter body was null or undefined when calling patchAccount.'
      );
    }

    if (accountId === null || accountId === undefined) {
      throw new Error(
        'Required parameter accountId was null or undefined when calling patchAccount.'
      );
    }

    let headers = this.defaultHeaders;

    // to determine the Accept header
    let httpHeaderAccepts: string[] = [];
    const httpHeaderAcceptSelected: string | undefined =
      this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected != undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    const consumes: string[] = ['application/json'];
    const httpContentTypeSelected: string | undefined =
      this.configuration.selectHeaderContentType(consumes);
    if (httpContentTypeSelected != undefined) {
      headers = headers.set('Content-Type', httpContentTypeSelected);
    }

    return this.httpClient.request<any>(
      'patch',
      `${this.basePath}/account/${encodeURIComponent(String(accountId))}`,
      {
        body: body,
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress,
      }
    );
  }

  /**
   * Get an account by ID
   *
   * @param accountId
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public retrieveAccount(
    accountId: number,
    observe?: 'body',
    reportProgress?: boolean
  ): Observable<Account>;
  public retrieveAccount(
    accountId: number,
    observe?: 'response',
    reportProgress?: boolean
  ): Observable<HttpResponse<Account>>;
  public retrieveAccount(
    accountId: number,
    observe?: 'events',
    reportProgress?: boolean
  ): Observable<HttpEvent<Account>>;
  public retrieveAccount(
    accountId: number,
    observe: any = 'body',
    reportProgress: boolean = false
  ): Observable<any> {
    if (accountId === null || accountId === undefined) {
      throw new Error(
        'Required parameter accountId was null or undefined when calling retrieveAccount.'
      );
    }

    let headers = this.defaultHeaders;

    // to determine the Accept header
    let httpHeaderAccepts: string[] = ['application/json'];
    const httpHeaderAcceptSelected: string | undefined =
      this.configuration.selectHeaderAccept(httpHeaderAccepts);
    if (httpHeaderAcceptSelected != undefined) {
      headers = headers.set('Accept', httpHeaderAcceptSelected);
    }

    // to determine the Content-Type header
    const consumes: string[] = [];

    return this.httpClient.request<Account>(
      'get',
      `${this.basePath}/account/${encodeURIComponent(String(accountId))}`,
      {
        withCredentials: this.configuration.withCredentials,
        headers: headers,
        observe: observe,
        reportProgress: reportProgress,
      }
    );
  }
}
