import { Injectable } from '@angular/core';
import { HelperService } from './HelperService';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { IRequestArrestLawsuitProveComparegetByCon } from '../interfaces/RequestArrestLawsuitProveCompare.interface';

@Injectable()
export class RequestArrestLawsuitProveCompareService extends HelperService {
  constructor(private http: HttpClient) {
    super();
  }
  public RequestArrestLawsuitProveComparegetByCon(TextSearch: IRequestArrestLawsuitProveComparegetByCon): Observable<any> {
    return this.http.post(
      `${this.ApiPrefixUrl}/RequestArrestLawsuitProveComparegetByCon`,
      TextSearch
    );
  }
}
