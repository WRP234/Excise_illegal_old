import { Injectable } from '@angular/core';
import { HelperService } from './HelperService';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import {
  IRequestPaymentFineDetailupdByCon,
  IRequestPaymentFineDetailgetByNoticeCode
} from '../interfaces/RequestPaymentFineDetail';

@Injectable()
export class RequestPaymentFineDetailService extends HelperService {
  constructor(private http: HttpClient) {
    super();
  }

  public RequestPaymentFineDetailupdByCon(
    param: IRequestPaymentFineDetailupdByCon
  ): Observable<any> {
    return this.http.post(
      `${this.ApiPrefixUrl}/RequestPaymentFineDetailupdByCon`,
      param
    );
  }

  public RequestPaymentFineDetailgetByNoticeCode(
    param: IRequestPaymentFineDetailgetByNoticeCode
  ): Observable<any> {
    return this.http.post(
      `${this.ApiPrefixUrl}/RequestPaymentFineDetailgetByNoticeCode`,
      param
    );
  }
}
