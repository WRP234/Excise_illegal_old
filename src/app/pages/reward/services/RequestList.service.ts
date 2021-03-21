import { Injectable } from '@angular/core';
import { HelperService } from './HelperService';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { IRequestListgetByConAdv, IRequestListgetByKeyword } from '../interfaces/RequestList.interface';

@Injectable()
export class RequestListService extends HelperService {
  constructor(private http: HttpClient) {
    super();
  }
  public RequestListgetByKeyword(TextSearch: IRequestListgetByKeyword): Observable<any> {
    return this.http.post(
      `${this.ApiPrefixUrl}/RequestListgetByKeyword`,
      TextSearch
    );
  }
  public RequestListgetByConAdv(ConAdv: IRequestListgetByConAdv): Observable<any> {
    return this.http.post(
        `${this.ApiPrefixUrl}/RequestListgetByConAdv`,
        ConAdv
      );
  }
}
