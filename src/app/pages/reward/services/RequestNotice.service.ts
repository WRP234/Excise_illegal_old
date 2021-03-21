import { Injectable } from '@angular/core';
import { HelperService } from './HelperService';
import { HttpClient } from '@angular/common/http';
import { IRequestNoticegetByArrestCode } from '../interfaces/RequestNotice';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class RequestNoticeService extends HelperService {
  constructor(private http: HttpClient) {
    super();
  }
  public RequestNoticegetByArrestCode(
    param: IRequestNoticegetByArrestCode
  ): Observable<any> {
    return this.http.post(
      `${this.ApiPrefixUrl}/RequestNoticegetByArrestCode`,
      param
    );
  }
}
