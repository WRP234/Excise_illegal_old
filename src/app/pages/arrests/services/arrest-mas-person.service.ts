import { Injectable } from "@angular/core";
import { ArrestHelperService } from "./arrest-helper.service";
import { HttpService } from "app/core/http.service";
import { Observable } from "rxjs";
import { ArrestMasPerson, SearchByKeyword, ArrestMasPersongetByConAdv } from "../models";
import { map } from "rxjs/operators";

@Injectable()
export class ArrestMasPersonService extends ArrestHelperService {

    constructor(
        private http: HttpService
    ) {
        super();
    }

    ArrestMasPersongetByKeyword(form: SearchByKeyword)
        : Observable<ArrestMasPerson[]> {
        return this.http.post(`${this.ArrestApiPrefixUrl}/ArrestMasPersongetByKeyword`, form)
            .pipe(map(x => x.json()));
    }

    ArrestMasPersongetByConAdv(form: ArrestMasPersongetByConAdv)
        : Observable<ArrestMasPerson[]> {
        return this.http.post(`${this.ArrestApiPrefixUrl}/ArrestMasPersongetByConAdv`, form)
            .pipe(map(x => x.json()));
    }
}

