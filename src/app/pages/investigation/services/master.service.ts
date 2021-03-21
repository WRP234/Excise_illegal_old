import { Injectable, isDevMode } from "@angular/core";
import { Observable } from "rxjs";
import {
    SearchByKeyword,
    MasLocale,
    MasLocaleMock,
} from "../models";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map } from "rxjs/operators";
import { InvestigateHelperService } from "./investigate-helper.service";

@Injectable()
export class MasterService extends InvestigateHelperService {
    constructor(private http: HttpClient) {
        super();
    }

    public searching: boolean;
    public searchFailed: boolean;
    public OFFICE_ID: number = parseInt(localStorage.getItem('OFFICE_ID')) || 2;

    private httpOptions = {
        headers: new HttpHeaders(
            {
                'Content-Type': 'application/json'
            })
    };

    public MasLocalegetByCon(params: SearchByKeyword): Observable<MasLocale[]> {
        const res = this.http.post(`${this.MasterApiPrefixUrl}/MasLocalegetByCon`, params);
        return this.PipeResponseData(res).pipe(
            map(x => isDevMode() && !x.length ? MasLocaleMock : x)
        );
    }

    public searchLocale = (text2$: Observable<string>) =>
        text2$
            .debounceTime(200)
            .distinctUntilChanged()
            .do(() => this.searching = true)
            .switchMap(term =>
                this.MasLocalegetByCon({ TEXT_SEARCH: term })
                    .do(() => this.searchFailed = false)
                    .catch(() => {
                        this.searchFailed = true;
                        return Observable.of([]);
                    })
            )
            .do(() => this.searching = false);
}