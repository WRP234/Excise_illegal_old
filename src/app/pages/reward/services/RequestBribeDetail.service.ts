import { Injectable } from '@angular/core';
import { HelperService } from './HelperService';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import {
  IRequestBribeDetailinsAll,
  IRequestBribeDetailupdDelete
} from '../interfaces/RequestBribeDetail.interface';

@Injectable()
export class RequestBribeDetailService extends HelperService {
  constructor(private http: HttpClient) {
    super();
  }

  public RequestBribeDetailinsAll(
    param: IRequestBribeDetailinsAll
  ): Observable<any> {
    return this.http.post(
      `${this.ApiPrefixUrl}/RequestBribeDetailinsAll`,
      param
    );
  }

  public RequestBribeDetailupdDelete(
    param: IRequestBribeDetailupdDelete
  ): Observable<any> {
    return this.http.post(
      `${this.ApiPrefixUrl}/RequestBribeDetailupdDelete`,
      param
    );
  }
}
