import { Injectable, isDevMode } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { appConfig } from '../../app.config';
import { Observable } from "rxjs/Observable";
import { staff, staffDelete } from './evidenceOut-Interface/staff';
import { map } from 'rxjs/operators';
import { EvidenceOut } from './evidenceOut-Interface/evidenceOut';
import { IMasStaffgetByCon } from '../model';
import { updDelete } from './evidenceOut-Interface/evidenceOut-document';

@Injectable()
export class EvidenceOutService {

  constructor(
    private http: HttpClient
  ) { }

  private httpOptions = {
    headers: new HttpHeaders(
      {
        'Content-Type': 'application/json'
      })
  };

  public PipeResponseData(obj: Observable<any>) {
    return obj.pipe(map(x => {
      if (x == null || x == undefined)
        return [];
      if (x['SUCCESS'] == true || "True")
        return x['RESPONSE_DATA'].slice(0, 10);
      return [];
    }));
  }

  /** List Component */
  async getByKeyword(Textsearch: any): Promise<any> {
    const params = JSON.stringify(Textsearch);
    const url = `${appConfig.api1111}/EvidenceOutListgetByKeyword`;

    try {
      const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
      return res as any;
    } catch (error) {
      return [];
    }
  }

  async getByConAdv(form: any): Promise<any> {
    const params = JSON.stringify(form);
    const url = `${appConfig.api1111}/EvidenceOutListgetByConAdv`;

    try {
      const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
      return res as any;
    } catch (error) {
      return [];
    }
  }

  /** Manage Component */
  public MasStaffgetByCon(params: IMasStaffgetByCon): Observable<any[]> {
    const res = this.http.post(`${appConfig.api1111}/MasStaffgetByCon`, params);
    return this.PipeResponseData(res).pipe(
      map(x => isDevMode() && !x.length ? [] : x)
    );
  }

  /** TransactionRunning */
  async TransactionRunninggetByCon(params): Promise<any> {
    const url = `${appConfig.api1111}/TransactionRunninggetByCon`;
    return await this.http.post<any>(url, params, this.httpOptions).toPromise();
  }

  async TransactionRunninginsAll(params): Promise<any> {
    const url = `${appConfig.api1111}/TransactionRunninginsAll`;
    return await this.http.post<any>(url, params, this.httpOptions).toPromise();
  }

  async TransactionRunningupdByCon(RUNNING_ID): Promise<any> {
    const params = { RUNNING_ID };
    const url = `${appConfig.api1111}/TransactionRunningupdByCon`;
    return await this.http.post<any>(url, params, this.httpOptions).toPromise();
  }

  /** evidence out */
  EvidenceOutinsAll(form: EvidenceOut): Observable<any> {
    return this.http.post(`${appConfig.api1111}/EvidenceOutinsAll`, form);
  }

  EvidenceOutupdDelete(id: any): Observable<any> {
    const param = { EVIDENCE_OUT_ID: id }
    return this.http.post(`${appConfig.api1111}/EvidenceOutupdDelete`, param);
  }

  EvidenceOutupdByCon(form: EvidenceOut): Observable<any> {
    return this.http.post(`${appConfig.api1111}/EvidenceOutupdByCon`, form);
  }

  EvidenceOutgetByCon(value: string): Observable<any> {
    const param = { EVIDENCE_OUT_ID: value }
    return this.http.post(`${appConfig.api1111}/EvidenceOutgetByCon`, param);
  }

  EvidenceOutStaffinsAll(form: staff[]): Observable<any> {
    return this.http.post(`${appConfig.api1111}/EvidenceOutStaffinsAll`, form);
  }

  EvidenceOutStaffupdDelete(form: staffDelete): Observable<any> {
    return this.http.post(`${appConfig.api1111}/EvidenceOutStaffupdDelete`, form);
  }

  EvidenceOutStockBalanceByLawsuitNo(form: any): Observable<any> {
    return this.http.post(`${appConfig.api1111}/EvidenceOutStockBalanceByLawsuitNo`, form);
  }

  EvidenceOutIteminsAll(form: any): Observable<any> {
    return this.http.post(`${appConfig.api1111}/EvidenceOutIteminsAll`, form);
  }

  EvidenceOutItemupdDelete(form: any): Observable<any> {
    return this.http.post(`${appConfig.api1111}/EvidenceOutItemupdDelete`, form);
  }

  EvidenceOutDetailinsAll(form: any): Observable<any> {
    return this.http.post(`${appConfig.api1111}/EvidenceOutDetailinsAll`, form);
  }

  EvidenceOutDetailupdByCon(form: any): Observable<any> {
    return this.http.post(`${appConfig.api1111}/EvidenceOutDetailupdByCon`, form);
  }

  EvidenceOutDetailupdDelete(form: any): Observable<any> {
    return this.http.post(`${appConfig.api1111}/EvidenceOutDetailupdDelete`, form);
  }

  /** document */
  GetDocumentByCon(form: any) {
    const url = `${appConfig.api1111}/GetDocumentByCon`;
    return this.http.post(url, form);
  }

  DocumentinsAll(form: any) {
    const formData = new FormData();
    formData.append('FILE', form.FILE);
    formData.append('DOCUMENT_NAME', form.DOCUMENT_NAME);
    formData.append('DOCUMENT_OLD_NAME', form.DOCUMENT_OLD_NAME);
    formData.append('DOCUMENT_TYPE', form.DOCUMENT_TYPE);
    formData.append('FOLDER', form.FOLDER);
    formData.append('REFERENCE_CODE', form.REFERENCE_CODE);
    const url = `${appConfig.api1111}/DocumentinsAll`;
    return this.http.post(url, formData);
  }

  DocumentupdDelete(form: updDelete) {
    const url = `${appConfig.api1111}/DocumentupdDelete`;
    return this.http.post<any>(url, form);
  }

  getImage(DOCUMENT_ID: any) {
    return `${appConfig.api1111}/getImage.html/${DOCUMENT_ID}`
  }

  downloadFile(DOCUMENT_ID: string) {
    const url = `${appConfig.api1111}/downloadFile.html/${DOCUMENT_ID}`
    return this.http.get(url, { responseType: 'arraybuffer', headers: this.httpOptions.headers });
  }

}


