import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HelperService } from './HelperService';
import {
  IRequestRewardStaffupdDelete,
  IRequestRewardStaffupdByCon,
  IRequestRewardStaffinsAll
} from '../interfaces/RequestRewardStaff';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class RequestRewardStaffService extends HelperService {
  constructor(private http: HttpClient) {
    super();
  }

  public RequestRewardStaffupdDelete(
    param: IRequestRewardStaffupdDelete
  ): Observable<any> {
    return this.http.post(
      `${this.ApiPrefixUrl}/RequestRewardStaffupdDelete`,
      param
    );
  }
  public RequestRewardStaffinsAll(
    param
  ): Observable<any> {
    return this.http.post(
      `${this.ApiPrefixUrl}/RequestRewardStaffinsAll`,
      param
    );
  }

  public RequestRewardStaffupdByCon(
    // param: IRequestRewardStaffupdByCon
    param
  ): Observable<any> {
    return this.http.post(
      `${this.ApiPrefixUrl}/RequestRewardStaffupdByCon`,
      param
    );
  }
}
