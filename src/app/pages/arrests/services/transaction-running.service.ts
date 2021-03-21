import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ArrestHelperService } from './arrest-helper.service';
import { Observable } from 'rxjs';
import { TransactionRunning, TransactionRunningupdByCon, TransactionRunninggetByCon } from '../models';

@Injectable()
export class TransactionRunningService extends ArrestHelperService {

    constructor(private http: HttpClient) {
        super();
    }

    TransactionRunninggetByCon(form: TransactionRunninggetByCon)
        : Observable<TransactionRunning[]> {
        const url = `${this.ArrestApiPrefixUrl}/TransactionRunninggetByCon`;
        return this.http.post<any>(url, form);
    }

    TransactionRunninginsAll(form: TransactionRunning)
        : Observable<any> {
        const url = `${this.ArrestApiPrefixUrl}/TransactionRunninginsAll`;
        return this.http.post<any>(url, form);
    }

    TransactionRunningupdByCon(form: TransactionRunningupdByCon)
        : Observable<any> {
        const url = `${this.ArrestApiPrefixUrl}/TransactionRunningupdByCon`;
        return this.http.post<any>(url, form);
    }

}
