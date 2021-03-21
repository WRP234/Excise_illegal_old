import { Injectable, isDevMode } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { appConfig } from '../../app.config';
import { Observable } from "rxjs/Observable";
import { map } from 'rxjs/operators';

@Injectable()
export class RevenueMasterService {

    public searching: boolean;
    public searchFailed: boolean;

    constructor(private httpClient: HttpClient) { }

    public MasStaffgetByCon(params: any): Observable<any[]> {
        const res = this.httpClient.post(`${appConfig.api1111}/MasStaffgetByCon`, params);
        return this.PipeResponseData(res).pipe(
            map(x => isDevMode() && !x.length ? [] : x.slice(0, 10))
        );
    }

    public MasOfficegetByCon_forList(params: any): Observable<any[]> {
        const res = this.httpClient.post(`${appConfig.api1111}/MasOfficegetByCon`, params);
        return this.PipeResponseData(res).pipe(
            map(x => isDevMode() && !x.length
                ? []
                : x.reduce((a, c) =>
                    [...a, c.OFFICE_SHORT_NAME], [])
                    .slice(0, 10))
        );
    }

    public PipeResponseData(obj: Observable<any>) {
        return obj.pipe(map(x => {
            if (x == null || undefined)
                return [];

            if (x['SUCCESS'] == true || "True")
                return x['RESPONSE_DATA'];

            return [];
        }));
    }

    public searchStaff = (text2$: Observable<string>) =>
        text2$
            .debounceTime(200)
            .distinctUntilChanged()
            .do(() => this.searching = true)
            .switchMap(term =>
                this.MasStaffgetByCon({ TEXT_SEARCH: term })
                    .do(() => this.searchFailed = false)
                    .catch(() => {
                        this.searchFailed = true;
                        return Observable.of([]);
                    })
            )
            .do(() => this.searching = false);



    public searchOffice_forList = (text2$: Observable<string>) =>
        text2$
            .debounceTime(200)
            .distinctUntilChanged()
            .do(() => this.searching = true)
            .switchMap(term =>
                this.MasOfficegetByCon_forList({ TEXT_SEARCH: term })
                    .do(() => this.searchFailed = false)
                    .catch(() => {
                        this.searchFailed = true;
                        return Observable.of([]);
                    })
            )
            .do(() => this.searching = false);


}