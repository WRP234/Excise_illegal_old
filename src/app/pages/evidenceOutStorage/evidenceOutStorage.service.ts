import { Injectable, isDevMode } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { appConfig } from 'app/app.config';
import { map } from "rxjs/operators";
import { EvidenceOut } from './evidenceOutStorage';

@Injectable()
export class EvidenceOutStorageService {

  constructor(
    private http: HttpClient
  ) { }

  private httpOptions = {
    headers: new HttpHeaders(
      {
        'Content-Type': 'application/json'
      })
  };

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

  async getEvidenceOutStockBalanceByLawsuitNo(form: any): Promise<any> {
    const params = JSON.stringify(form);
    const url = `${appConfig.api1111}/EvidenceOutStockBalanceByLawsuitNo`;

    try {
      const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
      return res as any;
    } catch (error) {
      return [];
    }
  }

  async EvidenceOutgetByCon(form: any): Promise<any> {
    const params = JSON.stringify(form);
    const url = `${appConfig.api1111}/EvidenceOutgetByCon`;

    try {
      const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
      return res as any;
    } catch (error) {
      return [];
    }
  }

  async EvidenceOutStockBalanceByEvidenceOutId(form: any): Promise<any> {
    const params = JSON.stringify(form);
    const url = `${appConfig.api1111}/EvidenceOutStockBalanceByEvidenceOutId`;

    try {
      const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
      return res as any;
    } catch (error) {
      return [];
    }
  }

  async EvidenceOutinsAll(req: EvidenceOut): Promise<any> {
    const params = JSON.stringify(req);
    const url = `${appConfig.api1111}/EvidenceOutinsAll`;

    try {
      const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
      return res;
    } catch (error) {
      return [];
    }
  }

  async EvidenceOutupdByCon(req: EvidenceOut): Promise<any> {
    const params = JSON.stringify(req);
    const url = `${appConfig.api1111}/EvidenceOutupdByCon`;

    try {
      const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
      return res;
    } catch (error) {
      return [];
    }
  }

  async EvidenceOutupdDelete(req: EvidenceOut): Promise<any> {
    const params = JSON.stringify(req);
    const url = `${appConfig.api1111}/EvidenceOutupdDelete`;

    try {
      const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
      return res;
    } catch (error) {
      return [];
    }
  }

  public MasStaffgetByCon_Search(params: any): Observable<any[]> {
    const res = this.http.post(`${appConfig.api2222}/MasStaffgetByCon`, params);
    return this.PipeResponseData(res).pipe(
      map(x => isDevMode() && !x.length ? [] : x.slice(0, 10))
    );
  }

  async TransactionRunninggetByCon(RunningTable, RunningOfficeCode): Promise<any> {
    let pValue = {
      "RUNNING_TABLE": RunningTable,
      "RUNNING_OFFICE_CODE": RunningOfficeCode
    }

    const params = JSON.stringify(pValue);
    const url = `${appConfig.api1111}/TransactionRunninggetByCon`;

    try {
      const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
      return res;
    } catch (error) {
      return [];
    }
  }

  async TransactionRunninginsAll(RunningOfficeCode, RunningTable, RunningPrefix): Promise<any> {
    let pValue = {
      "RUNNING_OFFICE_CODE": RunningOfficeCode,
      "RUNNING_TABLE": RunningTable,
      "RUNNING_PREFIX": RunningPrefix,
      "RUNNING_OFFICE_ID": 2
    }

    const params = JSON.stringify(pValue);
    const url = `${appConfig.api1111}/TransactionRunninginsAll`;

    try {
      const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
      return res;
    } catch (error) {
      return [];
    }
  }

  async TransactionRunningupdByCon(RunningID): Promise<any> {
    let pValue = {
      "RUNNING_ID": RunningID
    }

    const params = JSON.stringify(pValue);
    const url = `${appConfig.api1111}/TransactionRunningupdByCon`;

    try {
      const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
      return res;
    } catch (error) {
      return [];
    }
  }

  downloadFile(DOCUMENT_ID: string) {
    // const url = `${appConfig.api1111}/downloadFile.html/${DOCUMENT_ID}`
    const url = `${appConfig.api1111}/downloadFile.html/${DOCUMENT_ID}`;
    return this.http.get(url, { responseType: 'arraybuffer', headers: this.httpOptions.headers });
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

  getImage(DOCUMENT_ID: string) {
    return `${appConfig.api1111}/getImage.html/${DOCUMENT_ID}`;
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

  async GetDocumentByCon(DOCUMENT_TYPE, REFERENCE_CODE): Promise<any> {
    let pValue = {
      "DOCUMENT_TYPE": DOCUMENT_TYPE,
      "REFERENCE_CODE": REFERENCE_CODE
    }
    const params = JSON.stringify(pValue);
    const url = `${appConfig.api1111}/GetDocumentByCon`;
    try {
      const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
      return res as any;
    } catch (error) {
      return [];
    }
  }

  public MasOfficegetByCon_forSearch(params: any): Observable<any[]> {
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
      if (x == null || x == undefined)
        return [];

      if (x['SUCCESS'] == true || "True")
        return x['RESPONSE_DATA'];

      return [];
    }));
  }

  
}
