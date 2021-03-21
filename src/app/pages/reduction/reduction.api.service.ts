import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class ReductionApiService {
  private _api = '';
  private _api_port = '';
;
  constructor(
    private http: HttpClient
  ) {
    this._api = environment.api90;
    this._api_port = environment.api_port;
    // this._api = '';
  }

  /**
     * GET data from the server
     * @param url: string
     * @access public
     */
  public get(url: string): Observable<any> {
    return this.http
      .get<any>(this._api + url, httpOptions)
      .pipe(// ถ้าต้องการใช้ response data ** tap((res: ResponseData) => this.access(res)),
        catchError(this.handleError<any>('GetApi'))
      );
  }


  //////// Save methods //////////

  /**
   * POST: Add a new hero to the server
   * @param url: string
   * @param param: any
   * @access public
   */
  public post(url: string, param: any, port: any = null): Observable<any> {
    return this.http
      .post<any>(((port == null) ? this._api : this._api_port + port) +
                   url, JSON.stringify(param), httpOptions)
      .pipe(
        catchError(this.handleError<any>('PostApi'))
      );
  }

  /**
   * PUT: Update some record
   * @param url: string
   * @param param: any
   * @access public
   */
  public put(url: string, param: any): Observable<any> {
    return this.http
      .put<any>(this._api + url, JSON.stringify(param), httpOptions)
      .pipe(
        catchError(this.handleError<any>('PutApi'))
      );
  }

  /**
   * DELETE: Delete some record
   * @param url: string
   * @param param: any
   * @access public
   */
  public delete(url: string): Observable<any> {
    return this.http
      .delete<any>(this._api + url, httpOptions)
      .pipe(
        catchError(this.handleError<any>('PutApi'))
      );
  }

  /**
   * If data not error we need to check permistion or something
   * @param res
   * @access private
   */
  private access(res: any) {
    return res || {};
  }

  /**
	 * Handle Http operation that failed.
   * Let the app continue.
	 * @param operation
	 * @param result
   * @access private
	 */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      if (error.status === 401) {
        // this.router.navigate(['/system-login']);
        console.log('Access denied');
      }
      // TODO: send the error to remote logging infrastructure
      // console.error(error); // log to console instead
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}
