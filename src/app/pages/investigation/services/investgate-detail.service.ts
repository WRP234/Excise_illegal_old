import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { appConfig } from 'app/app.config';
import { HttpService } from 'app/core/http.service';

@Injectable()
export class InvestgateDetailService {

  constructor(
    private http: HttpService,
    private httpClient: HttpClient
  ) { }

  private httpOptions = {
    headers: new HttpHeaders(
      {
        'Content-Type': 'application/json'
      })
  };

  async InvestigateDetailgetByCon(InvestigateDetailID: string) {
    const params = { INVESTIGATE_DETAIL_ID: InvestigateDetailID };
    const url = `${appConfig.api1121}/InvestigateDetailgetByCon`;
    return await this.httpClient.post<any>(url, params, this.httpOptions).toPromise();
  }

  async InvestigateDetailinsAll(inves: any) {
    const params = inves;
    const url = `${appConfig.api1121}/InvestigateDetailinsAll`;
    return await this.httpClient.post<any>(url, params, this.httpOptions).toPromise();
  }

  async InvestigateDetailupdByCon(inves: any) {
    const params = inves;
    const url = `${appConfig.api1121}/InvestigateDetailupdByCon`;
    return await this.httpClient.post<any>(url, params, this.httpOptions).toPromise();
  }

  InvestigateDetailupdDelete(InvestigateDetailID: string) {
    const params = { INVESTIGATE_DETAIL_ID: InvestigateDetailID };
    const url = `${appConfig.api1121}/InvestigateDetailupdDelete`;
    return this.http.post(url, params).map(x => x.json());
  }


  ////////////////// Staff \\\\\\\\\\\\\\\\\\
  async InvestigateDetailStaffinsAll(staff: any) {
    const params = staff;
    const url = `${appConfig.api1121}/InvestigateDetailStaffinsAll`;
    return await this.httpClient.post<any>(url, params, this.httpOptions).toPromise();
  }

  async InvestigateDetailStaffupdByCon(staff: any) {
    const params = staff;
    const url = `${appConfig.api1121}/InvestigateDetailStaffupdByCon`;
    return await this.httpClient.post<any>(url, params, this.httpOptions).toPromise();

  }

  async InvestigateDetailStaffupdDelete(STAFF_ID: string) {
    const params = { STAFF_ID };
    const url = `${appConfig.api1121}/InvestigateDetailStaffupdDelete`;
    return await this.httpClient.post<any>(url, params, this.httpOptions).toPromise();
  }


  ////////////////// Product \\\\\\\\\\\\\\\\\\
  async InvestigateDetailProductinsAll(product: any) {
    const params = product;
    const url = `${appConfig.api1121}/InvestigateDetailProductinsAll`;
    return await this.httpClient.post<any>(url, params, this.httpOptions).toPromise();
  }

  async InvestigateDetailProductupdByCon(product: any) {
    const params = product;
    const url = `${appConfig.api1121}/InvestigateDetailProductupdByCon`;
    return await this.httpClient.post<any>(url, params, this.httpOptions).toPromise();
  }

  async InvestigateDetailProductupdDelete(PRODUCT_ID: string) {
    const params = { PRODUCT_ID };
    const url = `${appConfig.api1121}/InvestigateDetailProductupdDelete`;
    return await this.httpClient.post<any>(url, params, this.httpOptions).toPromise();
  }

  MasProductGroupgetByCon(PRODUCT_GROUP_CODE: string, PRODUCT_GROUP_ID: string): Promise<any> {
    const params = { PRODUCT_GROUP_CODE, PRODUCT_GROUP_ID }
    const url = `${appConfig.api1111}/MasProductGroupgetByCon`;
    return this.httpClient
      .post<any>(url, params, this.httpOptions)
      .toPromise();
  }

  ////////////////// Local \\\\\\\\\\\\\\\\\\
  async InvestigateDetailLocalinsAll(local: any) {
    const params = local;
    const url = `${appConfig.api1121}/InvestigateDetailLocalinsAll`;
    return await this.httpClient.post<any>(url, params, this.httpOptions).toPromise();
  }

  async InvestigateDetailLocalupdByCon(local: any) {
    const params = local;
    const url = `${appConfig.api1121}/InvestigateDetailLocalupdByCon`;
    return await this.httpClient.post<any>(url, params, this.httpOptions).toPromise();
  }

  async InvestigateDetailLocalupdDelete(LOCALE_ID: string) {
    const params = { LOCALE_ID };
    const url = `${appConfig.api1121}/InvestigateDetailLocalupdDelete`;
    return await this.httpClient.post<any>(url, params, this.httpOptions).toPromise();
  }


  ////////////////// Suspect \\\\\\\\\\\\\\\\\\
  async InvestigateDetailSuspectinsAll(suspect: any) {
    const params = suspect;
    const url = `${appConfig.api1121}/InvestigateDetailSuspectinsAll`;
    return await this.httpClient.post<any>(url, params, this.httpOptions).toPromise();
  }

  async InvestigateDetailSuspectupdByCon(suspect: any) {
    const params = suspect;
    const url = `${appConfig.api1121}/InvestigateDetailSuspectupdByCon`;
    return await this.httpClient.post<any>(url, params, this.httpOptions).toPromise();
  }

  async InvestigateDetailSuspectupdDelete(SUSPECT_ID: string) {
    const params = { SUSPECT_ID };
    const url = `${appConfig.api1121}/InvestigateDetailSuspectupdDelete`;
    return await this.httpClient.post<any>(url, params, this.httpOptions).toPromise();
  }
}
