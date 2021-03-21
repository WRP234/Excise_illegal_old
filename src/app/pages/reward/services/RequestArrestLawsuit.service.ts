import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HelperService } from './HelperService';
import { HttpClient } from '@angular/common/http';
import { IRequestArrestLawsuitGetByIndictmentId } from '../interfaces/RequestArrestLawsuit.interface';

@Injectable()
export class RequestArrestLawsuitService extends HelperService {
  constructor(private http: HttpClient) {
    super();
  }
  public RequestArrestLawsuitgetByIndictmentID(
    param: IRequestArrestLawsuitGetByIndictmentId
  ): Observable<any> {
    return this.http.post(
      `${this.ApiPrefixUrl}/RequestArrestLawsuitgetByIndictmentID`,
      param
    );
  }
}
