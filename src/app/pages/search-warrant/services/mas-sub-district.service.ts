import { Injectable, isDevMode } from "@angular/core";
import { ArrestHelperService } from "./arrest-helper.service";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { MasSubDistrict, MasSubDistrictgetByCon, MasSubDistrictMock } from "../models";
import { map } from "rxjs/operators";

@Injectable()
export class MasSubDistrictService extends ArrestHelperService {
    constructor(private http: HttpClient) {
        super();
    }

    MasSubDistrictgetByCon(params: MasSubDistrictgetByCon): Observable<MasSubDistrict[]> {
        const res = this.http.post(`${this.MasterApiPrefixUrl}/MasSubDistrictgetByCon`, params);
        return this.PipeResponseData(res).pipe(
            map(x => isDevMode() && !x.length ? MasSubDistrictMock : x)
        );
    }
}