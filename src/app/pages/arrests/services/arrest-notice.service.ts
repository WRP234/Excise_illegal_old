import { Injectable, isDevMode } from "@angular/core";
import { Observable } from "rxjs";
import { ArrestHelperService } from "./arrest-helper.service";
import { HttpService } from "../../../core/http.service";
import { SearchByKeyword } from "../models/search-by-keyword";
import { ArrestNotice, ArrestNoticeupdByCon, ArrestNoticeupdDelete, ArrestNoticeMock, ArrestNoticegetByConAdv } from "../models";
import { map } from "rxjs/operators";
import { HttpHeaders, HttpClient } from "@angular/common/http";

@Injectable()
export class ArrestNoticeService extends ArrestHelperService {

    constructor(
        private http: HttpService,
        private httpClient: HttpClient
    ) {
        super();
    }

    private httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

    public ArrestNoticegetByKeyword(form: SearchByKeyword)
        : Observable<ArrestNotice[]> {
        return this.http.post(`${this.ArrestApiPrefixUrl}/ArrestNoticegetByKeyword`, form)
            .pipe(
                map(x => {
                    const res = x.json()
                    return isDevMode() && !res.length ? [] : res;
                })
            );
    }

    public ArrestNoticegetByConAdv(form: ArrestNoticegetByConAdv)
        : Observable<ArrestNotice[]> {
        return this.http.post(`${this.ArrestApiPrefixUrl}/ArrestNoticegetByConAdv`, form)
            .pipe(
                map(x => {
                    const res = x.json()
                    return isDevMode() && !res.length ? [] : res;
                })
            );
    }

    public ArrestNoticeupdByCon(form: ArrestNoticeupdByCon[])
        : Observable<any> {
        const obj = form.reduce((accu, curr) => {
            return [
                ...accu,
                { ...curr, IS_MATCH: curr['IS_MATCH'] ? 1 : 0 }
            ]
        }, [])
        const url = `${this.ArrestApiPrefixUrl}/ArrestNoticeupdByCon`;
        return this.httpClient.post(url, obj, this.httpOptions);
    }

    public ArrestNoticeupdDelete(form: ArrestNoticeupdDelete[])
        : Observable<any> {
        const url = `${this.ArrestApiPrefixUrl}/ArrestNoticeupdDelete`;
        return this.httpClient.post(url, form, this.httpOptions);
    }
}