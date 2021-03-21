import { ArrestHelperService } from "./arrest-helper.service";
import { Injectable, isDevMode } from "@angular/core";
import {
    MasPerson,
    MasPersonAddress,
    MasPersonAddressupdDelete,
    MasPersonEducation,
    MasPersonEducationupdDelete,
    MasPersonRelationship,
    MasPersonRelationshipupdDelete,
    MasPersonPhoto,
    MasPersonPhotoupdDelete,
    MasPersonFingerPrint,
    MasPersonFingerPrintupdDelete,
    MasPersongetByConMock,
    MasPersonGetByCon
} from "../models";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { HttpService } from "../../../core/http.service";
import { map, mergeMap, switchMap, tap } from "rxjs/operators";
import { from } from "rxjs/observable/from";
import { MasSubDistrictService } from "./mas-sub-district.service";

@Injectable()
export class MasPersonService extends ArrestHelperService {
    constructor(
        private http: HttpClient,
        private httpService: HttpService
    ) {
        super();
    }

    MasPersongetByCon(form: MasPersonGetByCon): Observable<MasPerson[]> {
        const res = this.http.post(`${this.MasterApiPrefixUrl}/MasPersongetByCon`, form);
        return this.PipeResponseData(res)
            .pipe(
                map(x => isDevMode() && !x.length ? [] : x)
            );
    }

    MasPersoninsAll(form: MasPerson): Observable<any> {
        return this.httpService.post(`${this.MasterApiPrefixUrl}/MasPersoninsAll`, form)
            .pipe(map(x => x.json()));
    }

    MasPersonupdAll(form: MasPerson): Observable<any> {
        return this.http.post(`${this.MasterApiPrefixUrl}/MasPersonupdAll`, form);
    }

    MasPersonAddressinsAll(form: MasPersonAddress[]): Observable<any> {
        return this.http.post(`${this.MasterApiPrefixUrl}/MasPersonAddressinsAll`, form);
    }

    MasPersonAddressupdAll(form: MasPersonAddress[]): Observable<any> {
        return this.http.post(`${this.MasterApiPrefixUrl}/MasPersonAddressupdAll`, form);
    }

    MasPersonAddressupdDelete(form: MasPersonAddressupdDelete[]): Observable<any> {
        return this.http.post(`${this.MasterApiPrefixUrl}/MasPersonAddressupdDelete`, form);
    }

    MasPersonEducationinsAll(form: MasPersonEducation[]): Observable<any> {
        return this.http.post(`${this.MasterApiPrefixUrl}/MasPersonEducationinsAll`, form);
    }

    MasPersonEducationupdAll(form: MasPersonEducation[]): Observable<any> {
        return this.http.post(`${this.MasterApiPrefixUrl}/MasPersonEducationupdAll`, form);
    }

    MasPersonEducationupdDelete(form: MasPersonEducationupdDelete[]): Observable<any> {
        return this.http.post(`${this.MasterApiPrefixUrl}/MasPersonEducationupdDelete`, form);
    }

    MasPersonRelationshipinsAll(form: MasPersonRelationship[]): Observable<any> {
        return this.http.post(`${this.MasterApiPrefixUrl}/MasPersonRelationshipinsAll`, form);
    }

    MasPersonRelationshipupdAll(form: MasPersonRelationship[]): Observable<any> {
        return this.http.post(`${this.MasterApiPrefixUrl}/MasPersonRelationshipupdAll`, form);
    }

    MasPersonRelationshipupdDelete(form: MasPersonRelationshipupdDelete[]): Observable<any> {
        return this.http.post(`${this.MasterApiPrefixUrl}/MasPersonRelationshipupdDelete`, form);
    }

    MasPersonPhotoinsAll(form: MasPersonPhoto[]): Observable<any> {
        return this.http.post(`${this.MasterApiPrefixUrl}/MasPersonPhotoinsAll`, form);
    }

    MasPersonPhotoupdAll(form: MasPersonPhoto[]): Observable<any> {
        return this.http.post(`${this.MasterApiPrefixUrl}/MasPersonPhotoupdAll`, form);
    }

    MasPersonPhotoupdDelete(form: MasPersonPhotoupdDelete[]): Observable<any> {
        return this.http.post(`${this.MasterApiPrefixUrl}/MasPersonPhotoupdDelete`, form);
    }

    MasPersonFingerPrintinsAll(form: MasPersonFingerPrint[]): Observable<any> {
        return this.http.post(`${this.MasterApiPrefixUrl}/MasPersonFingerPrintinsAll`, form);
    }

    MasPersonFingerPrintupdAll(form: MasPersonFingerPrint[]): Observable<any> {
        return this.http.post(`${this.MasterApiPrefixUrl}/MasPersonFingerPrintupdAll`, form);
    }

    MasPersonFingerPrintupdDelete(form: MasPersonFingerPrintupdDelete[]): Observable<any> {
        return this.http.post(`${this.MasterApiPrefixUrl}/MasPersonFingerPrintupdDelete`, form);
    }

}

