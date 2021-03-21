import { Injectable } from "@angular/core";
import { HttpService } from "app/core/http.service";
import { ArrestProduct, ArrestProductupdDelete } from "../models/arrest-product";
import { HttpClient } from "@angular/common/http";
import { ArrestHelperService } from "./arrest-helper.service";
import { Observable } from "rxjs";

@Injectable()
export class ArrestProductService extends ArrestHelperService {

    constructor(
        private http: HttpService,
        private httpClient: HttpClient
    ) {
        super();
     }


    ArrestProductinsAll(form: ArrestProduct[]): Observable<any> {
        const url = `${this.ArrestApiPrefixUrl}/ArrestProductinsAll`;
        return this.httpClient.post(url, form);
    }

    ArrestProductupdByCon(form: ArrestProduct[]): Observable<any> {
        const url = `${this.ArrestApiPrefixUrl}/ArrestProductupdByCon`;
        return this.httpClient.post(url, form);
    }

    ArrestProductupdDelete(form: ArrestProductupdDelete[]): Observable<any> {
        const url = `${this.ArrestApiPrefixUrl}/ArrestProductupdDelete`;
        return this.httpClient.post(url, form);
    }
}