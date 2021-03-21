import { Injectable } from '@angular/core';
import { HelperService } from './HelperService';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import {
  IRequestBribegetByRequestBribeRewardID,
  IRequestBribegetByCommandID,
  IRequestBribegetByCon,
  IRequestBribeinsAll,
  IRequestBribeupdByCon,
  IRequestBribeupdDelete
} from '../interfaces/RequestBribe.interface';

@Injectable()
export class RequestBribeService extends HelperService {
  constructor(private http: HttpClient) {
    super();
  }

  public RequestBribegetByRequestBribeRewardID(
    param: IRequestBribegetByRequestBribeRewardID
  ): Observable<any> {
    return this.http.post(
      `${this.ApiPrefixUrl}/RequestBribegetByRequestBribeRewardID`,
      param
    );
  }

  public RequestBribegetByCommandID(
    param: IRequestBribegetByCommandID
  ): Observable<any> {
    return this.http.post(
      `${this.ApiPrefixUrl}/RequestBribegetByCommandID`,
      param
    );
  }

  public RequestBribegetByCon(param: IRequestBribegetByCon): Observable<any> {
    return this.http.post(`${this.ApiPrefixUrl}/RequestBribegetByCon`, param);
  }

  public RequestBribeinsAll(param): Observable<any> {
    return this.http.post(`${this.ApiPrefixUrl}/RequestBribeinsAll`, param);
  }

  public RequestBribeupdByCon(param): Observable<any> {
    return this.http.post(`${this.ApiPrefixUrl}/RequestBribeupdByCon`, param);
  }

  public RequestBribeupdDelete(param: IRequestBribeupdDelete): Observable<any> {
    return this.http.post(`${this.ApiPrefixUrl}/RequestBribeupdDelete`, param);
  }

  public RequestinsAll(param): Observable<any> {
    return this.http.post(`${this.ApiPrefixUrl}/RequestinsAll`, param);
  }
}
