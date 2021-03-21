import { Injectable, isDevMode } from "@angular/core";
import { ArrestHelperService } from "./arrest-helper.service";
import { HttpService } from "app/core/http.service";
import { Observable } from "rxjs";
import { ArrestPurityCert, ArrestPurityCertgetByConAdv, ArrestPurityCertMock, ArrestPurityCertupdByCon, ArrestPurityCertupdDelete } from "../models";
import { map } from "rxjs/operators";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable()
export class PurityCertService extends ArrestHelperService {
    constructor(
        private http: HttpService,
        private httpClient: HttpClient
    ) {
        super();
    }

    private httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

    ArrestPurityCertgetByKeyword(form: any): Observable<ArrestPurityCert[]> {
        return this.http
            .post(`${this.ArrestApiPrefixUrl}/ArrestPurityCertgetByKeyword`, form)
            .pipe(
                map(x => {
                    const res = x.json();
                    return isDevMode() && !res.length ? [] : res;
                })
            );
    }

    ArrestPurityCertgetByConAdv(form: ArrestPurityCertgetByConAdv): Observable<ArrestPurityCert[]> {
        return this.http
            .post(`${this.ArrestApiPrefixUrl}/ArrestPurityCertgetByConAdv`, form)
            .pipe(
                map(x => {
                    const res = x.json();
                    return isDevMode() && !res.length ? [] : res;
                })
            );
    }

    ArrestPurityCertupdByCon(form: ArrestPurityCertupdByCon[]): Observable<any> {
        const url = `${this.ArrestApiPrefixUrl}/ArrestPurityCertupdByCon`;
        return this.httpClient.post(url, form, this.httpOptions);
    }

    ArrestPurityCertupdDelete(form: ArrestPurityCertupdDelete[]): Observable<any> {
        const url = `${this.ArrestApiPrefixUrl}/ArrestPurityCertupdDelete`;
        return this.httpClient.post(url, form, this.httpOptions);
    }
}


