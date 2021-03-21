import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MasterHelperService } from './MasterHelperService';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class MasStaffService extends MasterHelperService {
  constructor(private http: HttpClient) {
    super();
  }

  public MasStaffMaingetAll(): Observable<any> {
    return this.http.post(`${this.ApiPrefixUrl}/MasStaffMaingetAll`, {});
  }
}
