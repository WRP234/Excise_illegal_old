import { Injectable } from "@angular/core";
import { ArrestHelperService } from "./arrest-helper.service";
import { HttpService } from "../../../core/http.service";
import { Observable } from "rxjs";
import { SearchByKeyword, IArrestMasGuiltbase } from "../models";
import { map } from "rxjs/operators";

@Injectable()
export class ArrestMasGuiltBaseService extends ArrestHelperService {

    constructor(
        private http: HttpService
    ) {
        super();
    }

    ArrestMasGuiltbasegetByKeyword(form: SearchByKeyword)
        : Observable<IArrestMasGuiltbase[]> {
        return this.http.post(`${this.ArrestApiPrefixUrl}/ArrestMasGuiltbasegetByKeyword`, form)
            .pipe(map(x => x.json()));
    }
}