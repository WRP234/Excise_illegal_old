import { Injectable } from '@angular/core';
import { MasterHelperService } from './MasterHelperService';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class MasTitleService extends MasterHelperService {
  constructor(private http: HttpClient) {
    super();
  }

  public MasTitleMaingetAll(): Observable<any> {
    return this.http.post(`${this.ApiPrefixUrl}/MasTitleMaingetAll`, {});
  }
}
