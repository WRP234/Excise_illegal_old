import { Injectable } from '@angular/core';
import { HelperService } from './HelperService';
import { HttpClient } from '@angular/common/http';
import { IRequestPaymentFineupdByCon } from '../interfaces/RequestPaymentFine';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class RequestPaymentFineService extends HelperService {
  constructor(private http: HttpClient) {
    super();
  }

  public RequestPaymentFineupdByCon(
    param: IRequestPaymentFineupdByCon
  ): Observable<any> {
    return this.http.post(
      `${this.ApiPrefixUrl}/RequestPaymentFineupdByCon`,
      param
    );
  }
}
