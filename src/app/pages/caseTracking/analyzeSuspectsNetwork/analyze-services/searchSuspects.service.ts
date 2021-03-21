import { Injectable, HostListener } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { appConfig } from '../../../../app.config';
import { PreloaderService } from '../../../../shared/preloader/preloader.component';
import { Http, Response, RequestOptions, Headers, Jsonp, ResponseContentType } from '@angular/http'
import { HttpService } from "../../../../core/http.service";
import { services } from '../../../arrests/services';
import { PersonListAdv } from '../analyze-models/searchSuspects-models'
import { Observable } from "rxjs/Observable";
import { map } from "rxjs/operators";
import { error } from 'util';
import { updDelete } from '../analyze-models/searchSuspects-models'

@Injectable()
export class SearchSuspectsService {
  constructor(private httpClient: HttpClient,
    private preloaderService: PreloaderService,
    private http: Http,
    private httpService: HttpService) { }

  private httpOptions = {
    headers: new HttpHeaders(
      {
        'Content-Type': 'application/json'
      })
  };

  I18N_VALUES = {
    weekdays: ['อ.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'],
    months: ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม']
  };

  setDateStruct(date) {
    let months = this.I18N_VALUES.months;
    let temp = date = new Date(date);
    let CompDate = `${temp.getUTCDate()} ${months[temp.getMonth()]} ${temp.getUTCFullYear() + 543}`;
    return CompDate;
  }

  ArrestgetByCon(form: any): Observable<any> {
    const res = this.http.post(`${appConfig.api1111}/ArrestgetByCon`, form);
    return res.pipe(map(x => x.json()));
  }

  ArrestgetByPersonId(form): Observable<any> {
    const params = { PERSON_ID: form }
    const url = `${appConfig.api1111}/ArrestgetByPersonId`;
    return this.httpClient.post<any>(url, params);
  }

  LawbreakerRelationshipgetByPersonId(form): Observable<any> {
    // const params = { ARREST_CODE: form }
    const url = `${appConfig.api1111}/LawbreakerRelationshipgetByPersonId`;
    return this.httpClient.post<any>(url, form);
  }

  PersonListgetByConAdv(params) {
    const url = `${appConfig.api1119}/PersonListgetByConAdv`;
    return this.httpClient.post<any>(url, params, this.httpOptions);
  }

  PersonDetailgetByPersonId(form): Observable<any> {
    const params = { PERSON_ID: form }
    const url = `${appConfig.api1119}/PersonDetailgetByPersonId`;
    return this.httpClient.post<any>(url, params, this.httpOptions);
  }

  PersonListgetByKeyword(params) {
    const url = `${appConfig.api1119}/PersonListgetByKeyword`;
    return this.httpClient.post<any>(url, params, this.httpOptions);
  }

  DocumentinsAll(form: any) {
    const url = `${appConfig.api1111}/DocumentinsAll`;
    return this.httpClient.post(url, form);
  }

  DocumentupdDelete(form: updDelete) {
    const url = `${appConfig.api1111}/DocumentupdDelete`;
    return this.httpClient.post(url, form);
  }

  GetDocumentByCon(DOCUMENT_TYPE, REFERENCE_CODE) {
    const form = { DOCUMENT_TYPE, REFERENCE_CODE }
    const url = `${appConfig.api1111}/GetDocumentByCon`;
    return this.httpClient.post(url, form);
  }

} 