import { Injectable } from "@angular/core";
import { ArrestHelperService } from "./arrest-helper.service";
import { HttpService } from "../../../core/http.service";
import { Observable } from "rxjs";
import { SearchByKeyword, IArrestMasGuiltbase } from "../model";
import { map } from "rxjs/operators";
import {Puritycert} from '../puritycert';
import {appConfig} from '../../../app.config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {ArrestStaff, IMasStaffgetByCon} from '../../model';

@Injectable()
export class ArrestMasGuiltBaseService extends ArrestHelperService {

    constructor(
        private http: HttpClient
    ) {
        super();
    }


  ArrestMasGuiltbasegetByKeyword(form: SearchByKeyword) {
    const res =  this.http.post(`${this.ArrestApiPrefixUrl}/ArrestMasGuiltbasegetByKeyword`, form).toPromise();
    return (res);
  }

    // ArrestMasGuiltbasegetByKeyword(form: SearchByKeyword): Observable<IArrestMasGuiltbase[]> {
    //     const res = this.http.post(`${this.ArrestApiPrefixUrl}/ArrestMasGuiltbasegetByKeyword`, form);
    //     return this.PipeResponseData(res);
    // }

  // public MasStaffgetByCon(params: IMasStaffgetByCon): Observable<ArrestStaff[]> {
  //   const res = this.http.post(`${this.MasterApiPrefixUrl}/MasStaffgetByCon`, params);
  //   return this.PipeResponseData(res);
  // }


}
