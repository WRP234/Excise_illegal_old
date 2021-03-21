import { Injectable } from "@angular/core";
import { HttpService } from "app/core/http.service";
import { Observable } from "rxjs";
import { ArrestLawbreaker, ArrestLawbreakerupdDelete } from "../models";
import { ArrestHelperService } from "./arrest-helper.service";
import { map } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class ArrestLawbreakerService extends ArrestHelperService {

    constructor(
        private http: HttpClient
    ) {
        super();
    }

    ArrestLawbreakerinsAll(form: ArrestLawbreaker[]): Observable<any> {
        return this.http.post(`${this.ArrestApiPrefixUrl}/ArrestLawbreakerinsAll`, form);
    }

    ArrestLawbreakerupdDelete(form: ArrestLawbreakerupdDelete[]): Observable<any> {
        return this.http.post(`${this.ArrestApiPrefixUrl}/ArrestLawbreakerupdDelete`, form);
    }
}