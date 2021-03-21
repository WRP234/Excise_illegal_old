import { Injectable } from '@angular/core';
import { HelperService } from './HelperService';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { INonRequestRewardStaffgetByIndictmentID } from '../interfaces/NonRequestRewardStaff';

@Injectable()
export class NonRequestRewardStaffService extends HelperService {
    constructor(private http: HttpClient) {
      super();
    }
    public NonRequestRewardStaffgetByIndictmentID(
      param: INonRequestRewardStaffgetByIndictmentID
    ): Observable<any> {
      return this.http.post(
        `${this.ApiPrefixUrl}/NonRequestRewardStaffgetByIndictmentID`,
        param
      );
    }
  }
