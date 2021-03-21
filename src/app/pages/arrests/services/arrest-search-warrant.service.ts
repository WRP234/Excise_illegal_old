import { Injectable, isDevMode } from "@angular/core";
import { HttpService } from "../../../core/http.service";
import { ArrestSearchWarrantupdDelete, ArrestSearchWarrantupdByCon, ArrestSearchWarrant, ArrestSearchWarrantgetByConAdv, ArrestSearchWarrantMock } from "../models";
import { Observable } from "rxjs";
import { ArrestHelperService } from "./arrest-helper.service";
import { SearchByKeyword } from "../models/search-by-keyword";
import { map, catchError } from "rxjs/operators";
import { HttpHeaders, HttpClient } from "@angular/common/http";

@Injectable()
export class ArrestSearchWarrantService extends ArrestHelperService {

    constructor(
        private http: HttpService,
        private httpClient: HttpClient
    ) {
        super();
    }

    private httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

    public ArrestSearchWarrantgetByKeyword(form: SearchByKeyword)
        : Observable<ArrestSearchWarrant[]> {
        return this.http.post(`${this.ArrestApiPrefixUrl}/ArrestSearchWarrantgetByKeyword`, form)
            .pipe(
                map(x => {
                    const res = x.json();
                    return isDevMode() && !res.length ? [] : res;
                }),
                catchError((error: any, caught: Observable<any>) => {
                    return isDevMode() ? [] : Observable.throw(error);
                })
            );
    }

    public ArrestSearchWarrantgetByConAdv(form: ArrestSearchWarrantgetByConAdv)
        : Observable<ArrestSearchWarrant[]> {
        return this.http.post(`${this.ArrestApiPrefixUrl}/ArrestSearchWarrantgetByConAdv`, form)
            .pipe(
                map(x => {
                    const res = x.json();
                    return isDevMode() && !res.length ? [] : res;
                }),
                catchError((error: any, caught: Observable<any>) => {
                    return isDevMode() ? [] : Observable.throw(error);
                })
            );
    }

    public ArrestSearchWarrantupdByCon(form: ArrestSearchWarrantupdByCon[])
        : Observable<any> {
        const url = `${this.ArrestApiPrefixUrl}/ArrestSearchWarrantupdByCon`;
        return this.httpClient.post(url, form, this.httpOptions);
    }

    public ArrestSearchWarrantupdDelete(form: ArrestSearchWarrantupdDelete[])
        : Observable<any> {
        const url = `${this.ArrestApiPrefixUrl}/ArrestSearchWarrantupdDelete`;
        return this.httpClient.post(url, form, this.httpOptions);
    }
}