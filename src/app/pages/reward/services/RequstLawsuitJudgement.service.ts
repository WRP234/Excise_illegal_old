import { Injectable } from '@angular/core';
import { HelperService } from './HelperService';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { IRequestLawsuitJudgementgetByIndictmentID } from '../interfaces/RequestLawsuitJudgement';

@Injectable()
export class RequstLawsuitJudgementService extends HelperService {
    constructor(private http: HttpClient) {
      super();
    }
    public RequstLawsuitJudgementgetByIndictmentID(
      param: IRequestLawsuitJudgementgetByIndictmentID
    ): Observable<any> {
      return this.http.post(
        `${this.ApiPrefixUrl}/RequstLawsuitJudgementgetByIndictmentID`,
        param
      );
    }

}
