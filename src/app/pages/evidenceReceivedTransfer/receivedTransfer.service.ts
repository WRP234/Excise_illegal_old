import { Observable } from "rxjs";
import { appConfig } from "app/app.config";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable, isDevMode } from "@angular/core";
import { map } from "rxjs/operators";

@Injectable()
export class ReceivedTransferService {

    constructor(
        private http: HttpClient) { }

    private httpOptions = {
        headers: new HttpHeaders(
            {
                'Content-Type': 'application/json'
            })
    };

    public PipeResponseData(obj: Observable<any>) {
        return obj.pipe(map(x => {
            if (x == null || x == undefined)
                return [];
            if (x['SUCCESS'] == true || "True")
                return x['RESPONSE_DATA'].slice(0, 10);
            return [];
        }));
    }

    public MasStaffgetByCon(params: any): Observable<any[]> {
        const res = this.http.post(`${appConfig.api1111}/MasStaffgetByCon`, params);
        return this.PipeResponseData(res).pipe(
            map(x => isDevMode() && !x.length ? [] : x)
        );
    }

}