import { Injectable } from '@angular/core';
import { HelperService } from './HelperService';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { IRequestArrestLawsuitProveComparegetByCon } from '../interfaces/RequestArrestLawsuitProveCompare.interface';
import { IRequestStaffListgetByCon } from '../interfaces/RequestStaffList.interface';

@Injectable()
export class RequestStaffListService extends HelperService {
  constructor(private http: HttpClient) {
    super();
  }
  public RequestStaffListgetByCon(TextSearch: IRequestStaffListgetByCon): Observable<any> {
    return this.http.post(
      `${this.ApiPrefixUrl}/RequestStaffListgetByCon`,
      TextSearch
    );
  }
}
