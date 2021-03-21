import { Injectable, isDevMode } from "@angular/core";
import { ArrestHelperService } from "./arrest-helper.service";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ArrestStaff, IMasStaffgetByCon, IMasStaffgetByConAdv, ArrestStaffMock } from "../models";
import { map } from "rxjs/operators";

@Injectable()
export class MasStaffService extends ArrestHelperService {
    constructor(private http: HttpClient) {
        super();
    }

    public searching: boolean;
    public searchFailed: boolean;

    public MasStaffgetByCon(params: IMasStaffgetByCon): Observable<ArrestStaff[]> {
        const res = this.http.post(`${this.ArrestApiPrefixUrl}/MasStaffgetByCon`, params);
        return this.PipeResponseData(res).pipe(
            map(x => isDevMode() && !x.length ? [] : x.slice(0, 10))
        );
    }

    MasStaffgetByConAdv(params: IMasStaffgetByConAdv): Observable<ArrestStaff[]> {
        const res = this.http.post(`${this.MasterApiPrefixUrl}/MasStaffgetByConAdv`, params);
        return this.PipeResponseData(res).pipe(
            map(x => isDevMode() && !x.length ? [] : x)
        );
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
}