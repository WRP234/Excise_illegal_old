import { Injectable } from "@angular/core";
import { HttpService } from "app/core/http.service";
import { appConfig } from "app/app.config";
import { HttpClient } from "@angular/common/http";
import { ArrestIndictmentProduct, ArrestIndictment, ArrestIndictmentupdByCon, ArrestIndictmentupdDelete, ArrestIndictmentProductupdDelete, ArrestIndictmentDetail, ArrestIndictmentDetailupdDelete } from "../models";
import { Observable } from "rxjs";
import { ArrestHelperService } from "./arrest-helper.service";

@Injectable()
export class ArrestIndictmentService extends ArrestHelperService {

    constructor(
        private http: HttpClient,
    ) {
        super();
    }

    ArrestIndictmentinsAll(form: ArrestIndictment[]): Observable<any> {
        const url = `${this.ArrestApiPrefixUrl}/ArrestIndictmentinsAll`;
        return this.http.post(url, form);
    }

    ArrestIndictmentupdByCon(form: ArrestIndictment[]): Observable<any> {
        const obj = form.reduce((accu, curr) => {
            return [
                ...accu,
                {
                    INDICTMENT_ID: curr.INDICTMENT_ID,
                    ARREST_ID: curr.ARREST_ID,
                    GUILTBASE_ID: curr.GUILTBASE_ID,
                    FINE_ESTIMATE: curr.FINE_ESTIMATE,
                    IS_LAWSUIT_COMPLETE: curr.IS_LAWSUIT_COMPLETE,
                    IS_ACTIVE: curr.IS_ACTIVE
                }
            ];
        }, []) as ArrestIndictmentupdByCon[];

        const url = `${this.ArrestApiPrefixUrl}/ArrestIndictmentupdByCon`;
        return this.http.post(url, obj);
    }

    ArrestIndictmentupdDelete(form: ArrestIndictmentupdDelete[]): Observable<any> {
        const url = `${this.ArrestApiPrefixUrl}/ArrestIndictmentupdDelete`;
        return this.http.post(url, form);
    }

    ArrestIndictmentProductinsAll(form: ArrestIndictmentProduct[])
        : Observable<any> {
        const url = `${this.ArrestApiPrefixUrl}/ArrestIndictmentProductinsAll`;
        return this.http.post(url, form);
    }

    ArrestIndictmentProductupdByCon(form: ArrestIndictmentProduct[])
        : Observable<any> {
        const url = `${this.ArrestApiPrefixUrl}/ArrestIndictmentProductupdByCon`;
        return this.http.post(url, form);
    }

    ArrestIndictmentProductupdDelete(form: ArrestIndictmentProductupdDelete[])
        : Observable<any> {
        const url = `${this.ArrestApiPrefixUrl}/ArrestIndictmentProductupdDelete`;
        return this.http.post(url, form);
    }

    ArrestIndictmentDetailinsAll(form: ArrestIndictmentDetail[])
        : Observable<any> {
        const url = `${this.ArrestApiPrefixUrl}/ArrestIndictmentDetailinsAll`;
        return this.http.post(url, form);
    }

    ArrestIndictmentDetailupdDelete(form: ArrestIndictmentDetailupdDelete[])
        : Observable<any> {
        const url = `${this.ArrestApiPrefixUrl}/ArrestIndictmentDetailupdDelete`;
        return this.http.post(url, form);
    }
}