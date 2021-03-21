import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HelperService } from './HelperService';
import { Observable } from 'rxjs/Observable';
import { IRequestRewardDetailupdDelete } from '../interfaces/RequestRewardDetail';

@Injectable()
export class RequestRewardDetailService extends HelperService {
  constructor(private http: HttpClient) {
    super();
  }

  public RequestRewardDetailupdDelete(
    param: IRequestRewardDetailupdDelete
  ): Observable<any> {
    return this.http.post(
      `${this.ApiPrefixUrl}/RequestRewardDetailupdDelete`,
      param
    );
  }
}
