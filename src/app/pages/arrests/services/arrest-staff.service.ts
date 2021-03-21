import { Injectable } from "@angular/core";
import { appConfig } from "app/app.config";
import { HttpService } from "app/core/http.service";
import { Arrest } from "../models/arrest";
import { ArrestStaff, ArrestStaffupdDelete } from "../models/arrest-staff";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { ArrestHelperService } from "./arrest-helper.service";

@Injectable()
export class ArrestStaffService extends ArrestHelperService {

    constructor(private http: HttpService,
        private httpClient: HttpClient
    ) {
        super();
    }

    private httpOptions = {
        headers: new HttpHeaders(
            {
                'Content-Type': 'application/json'
            })
    };

    ArrestStaffinsAll(form: ArrestStaff[]): Observable<any> {
        return this.httpClient.post(`${this.ArrestApiPrefixUrl}/ArrestStaffinsAll`, form);
    }

    ArrestStaffupdByCon(form: ArrestStaff[]): Observable<any> {
        return this.httpClient.post(`${this.ArrestApiPrefixUrl}/ArrestStaffupdByCon`, form);
    }

    ArrestStaffupdDelete(form: ArrestStaffupdDelete[]): Observable<any> {
        return this.httpClient.post(`${this.ArrestApiPrefixUrl}/ArrestStaffupdDelete`, form);
    }

  // ArrestStaffupdByCon(form: ArrestStaff[]): Observable<any> {
  //   return this.httpClient.post(`${this.ArrestApiPrefixUrl}/ArrestStaffupdByCon`, form);
  // }

}
