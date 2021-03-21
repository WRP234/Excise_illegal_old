import { Injectable, isDevMode } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { appConfig } from '../../app.config';
import { Observable } from "rxjs/Observable";
import { ISearchMasOffice, IMasOffice } from '../arrests/models';
import { map } from "rxjs/operators";

@Injectable()
export class MasterService {

  constructor(private http: HttpClient) { }

  private httpOptions = {
    headers: new HttpHeaders(
      {
        'Content-Type': 'application/json'
      })
  };

  async getByKeyword(oFunc: string, oParam: any): Promise<any> {
    const params = JSON.stringify(oParam);
    const url = `${appConfig.api2222}/${oFunc}`;

    try {
      const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
      return res as any;
    } catch (error) {
      return [];
    }
  }

  async getapi1111(oFunc: string, oParam: any): Promise<any> {
    const params = JSON.stringify(oParam);
    const url = `${appConfig.api1111}/${oFunc}`;

    try {
      const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
      return res as any;
    } catch (error) {
      return [];
    }
  }

  async getAPI1111(oFunc: string, oParam: any): Promise<any> {
    const params = JSON.stringify(oParam);
    const url = `${appConfig.api1111}/${oFunc}`;

    try {
      const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
      return res as any;
    } catch (error) {
      return [];
    }
  }

  async getAPI2222(oFunc: string, oParam: any): Promise<any> {
    const params = JSON.stringify(oParam);
    const url = `${appConfig.api2222}/${oFunc}`;

    try {
      const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
      return res as any;
    } catch (error) {
      return [];
    }
  }

  async getByConAdv(oFunc: string, form: any): Promise<any> {
    const params = JSON.stringify(form);
    const url = `${appConfig.api2222}/${oFunc}`;

    try {
      const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
      return res as any;
    } catch (error) {
      return [];
    }
  }

  async MasinsAll(oFunc: string, oParam: any): Promise<any> {
    const params = JSON.stringify(oParam);
    const url = `${appConfig.api1111}/${oFunc}`;

    try {
      const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
      return res as any;
    } catch (error) {
      return [];
    }
  }

  async MasUpdAll(oFunc: string, oParam: any): Promise<any> {
    const params = JSON.stringify(oParam);
    const url = `${appConfig.api2222}/${oFunc}`;

    try {
      const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
      return res as any;
    } catch (error) {
      return [];
    }
  }

  async MasDelAll(oFunc: string, oParam: any): Promise<any> {
    const params = JSON.stringify(oParam);
    const url = `${appConfig.api2222}/${oFunc}`;

    try {
      const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
      return res as any;
    } catch (error) {
      return [];
    }
  }

  MasProductMappinginsAll(form: any): Observable<any> {
    return this.http.post(`${appConfig.api1111}/MasProductMappinginsAll`, form);
  }

  MasProductMappingupdAll(form: any): Observable<any> {
    return this.http.post(`${appConfig.api1111}/MasProductMappingupdAll`, form);
  }

  MasProductMappingupdDelete(form: any): Observable<any> {
    return this.http.post(`${appConfig.api1111}/MasProductMappingupdDelete`, form);
  }

  async getStation(): Promise<any> {
    const params = {};
    const url = `${appConfig.api1111}/MasOfficeMaingetAll`;

    try {
      const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
      return res;
    } catch (error) {
    }
  }

  async DocumentAPI(oFunc: string, oParam: any): Promise<any> {
    const url = `${appConfig.api1111}/${oFunc}`;

    try {
      const res = await this.http.post<any>(url, oParam).toPromise();
      return res as any;
    } catch (error) {
      return [];
    }
  }

  GetDocumentByCon(DOCUMENT_TYPE, REFERENCE_CODE) {
    const form = { DOCUMENT_TYPE, REFERENCE_CODE }
    const url = `${appConfig.api1111}/GetDocumentByCon`;
    return this.http.post(url, form);
  }

  getImage(DOCUMENT_ID: string) {
    return `${appConfig.api1111}/getImage.html/${DOCUMENT_ID}`
  }

  async DocumentupdDelete(DOCUMENT_ID: string): Promise<any> {
    const params = { DOCUMENT_ID };
    const url = `${appConfig.api1111}/DocumentupdDelete`;
    try {
      const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
      return res as any;
    } catch (error) {
      return [];
    }
  }

  public MasOfficegetByCon_forSearch(params: ISearchMasOffice): Observable<IMasOffice[]> {
    const res = this.http.post(`${appConfig.api1111}/MasOfficegetByCon`, params);
    return this.PipeResponseData(res).pipe(
      map(x => isDevMode() && !x.length ? [] : this.setOfficeName(x))
    );
  }

  public setOfficeName(input: any[] = []) {
    return input.reduce((a, c) => [...a, c.OFFICE_SHORT_NAME], []).slice(0, 10);
  }

  public PipeResponseData(obj: Observable<any>) {
    return obj.pipe(map(x => {
      if (x == null || undefined)
        return [];

      if (x['SUCCESS'] == true || "True")
        return x['RESPONSE_DATA'];

      return [];
    }));
  }

  public MasStaffgetByCon_Search(params: any): Observable<any[]> {
    const res = this.http.post(`${appConfig.api1111}/MasStaffgetByCon`, params);
    return this.PipeResponseData(res).pipe(
      map(x => isDevMode() && !x.length ? [] : x.slice(0, 10))
    );
  }

  async InquiryDutyTable(requestData): Promise<any> {
    const form = {
      "systemId": "WSS",
      "userName": "wss001",
      "password": "123456",
      "ipAddress": "10.1.1.1",
      "requestData": requestData
    }
    const params = JSON.stringify(form);
    const url = `${appConfig.XCS_DNS_SERVICE}/rdb/InquiryDutyTable`;
    return await this.http.post<any>(url, params, this.httpOptions).toPromise();
  }

  async InquiryProductType(requestData): Promise<any> {
    const form = {
      "systemId": "WSS",
      "userName": "wss001",
      "password": "123456",
      "ipAddress": "10.1.1.1",
      "requestData": requestData
    }
    const params = JSON.stringify(form);
    const url = `${appConfig.XCS_DNS_SERVICE}/rdb/InquiryProductType`;
    return await this.http.post<any>(url, params, this.httpOptions).toPromise();
  }

  async InquiryProductSubType(requestData): Promise<any> {
    const form = {
      "systemId": "WSS",
      "userName": "wss001",
      "password": "123456",
      "ipAddress": "10.1.1.1",
      "requestData": requestData
    }
    const params = JSON.stringify(form);
    const url = `${appConfig.XCS_DNS_SERVICE}/rdb/InquiryProductSubtype`;
    return await this.http.post<any>(url, params, this.httpOptions).toPromise();
  }

}
