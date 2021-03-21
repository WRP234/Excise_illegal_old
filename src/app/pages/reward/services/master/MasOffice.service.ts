import { Injectable } from '@angular/core';
import { MasterHelperService } from './MasterHelperService';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class MasOfficeService extends MasterHelperService {
  constructor(private http: HttpClient) {
    super();
  }

  public MasOfficeMaingetAll(): Observable<any> {
    return this.http.post(`${this.ApiPrefixUrl}/MasOfficeMaingetAll`, {});
  }
}
