import { Injectable } from '@angular/core';
import { HelperService } from './HelperService';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { IRequestComparegetByIndictmentID } from '../interfaces/RequestCompare';

@Injectable()
export class RequestCompareService extends HelperService {
  constructor(private http: HttpClient) {
    super();
  }
  public RequestComparegetByIndictmentID(
    param: IRequestComparegetByIndictmentID
  ): Observable<any> {
    return this.http.post(
      `${this.ApiPrefixUrl}/RequestComparegetByIndictmentID`,
      param
    );
  }
}
