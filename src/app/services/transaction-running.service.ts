import { Injectable } from '@angular/core';
import { HttpService } from 'app/core/http.service';
import { appConfig } from 'app/app.config';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable()
export class TransactionRunningService {

    constructor(private http: HttpClient) { }

    private httpOptions = {
        headers: new HttpHeaders(
            {
                'Content-Type': 'application/json'
            })
    };

    async TransactionRunninggetByCon(RunningTable: string, RunningOfficeCode: string) {
        const params = { RunningTable, RunningOfficeCode };
        const url = `${appConfig.api1111}/TransactionRunninggetByCon`;
        return await this.http.post<any>(url, params, this.httpOptions).toPromise();
    }

    async TransactionRunninginsAll(RunningOfficeCode: string, RunningTable: string, RunningPrefix: string) {
        const params = { RunningTable, RunningOfficeCode, RunningPrefix };
        const url = `${appConfig.api1111}/TransactionRunninginsAll`;
        return await this.http.post<any>(url, params, this.httpOptions).toPromise();
    }

    async TransactionRunningupdByCon(RunningID: string) {
        const params = { RunningID };
        const url = `${appConfig.api1111}/TransactionRunningupdByCon`;
        return await this.http.post<any>(url, params, this.httpOptions).toPromise();
    }
    // ################################ PH.2 ###################################
    async TransactionRunninggetByCon_ph2(RUNNING_TABLE: string, RUNNING_OFFICE_CODE: string) {
        const params = { RUNNING_TABLE, RUNNING_OFFICE_CODE };
        const url = `${appConfig.api1111}/TransactionRunninggetByCon`;
        return await this.http.post<any>(url, params, this.httpOptions).toPromise();
    }
    async TransactionRunningupdByCon_ph2(RUNNING_ID: string) {
        const params = { RUNNING_ID };
        const url = `${appConfig.api1111}/TransactionRunningupdByCon`;
        return await this.http.post<any>(url, params, this.httpOptions).toPromise();
    }
    async TransactionRunninginsAll_ph2(RUNNING_OFFICE_ID: string, RUNNING_OFFICE_CODE: string, RUNNING_TABLE: string, RUNNING_PREFIX: string) {
        const params = { RUNNING_OFFICE_ID, RUNNING_TABLE, RUNNING_OFFICE_CODE, RUNNING_PREFIX };
        const url = `${appConfig.api1111}/TransactionRunninginsAll`;
        return await this.http.post<any>(url, params, this.httpOptions).toPromise();
    }
    // ################################END PH.2 ###################################

}
