import { Injectable, HostListener } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { appConfig } from '../../app.config';
import { Prove } from './prove';
import { ProveDocument } from './proveDoc';
import { ProveProduct } from './proveProduct';
import { ProveScience, ProveDeliverProduct } from './proveScience';
import { Observable } from "rxjs/Observable";

@Injectable()
export class ProveService {

  constructor(private http: HttpClient) { }

  private httpOptions = {
    headers: new HttpHeaders(
      {
        'Content-Type': 'application/json'
      })
  };

  async getByKeyword(Textsearch: any): Promise<any> {
    const params = JSON.stringify(Textsearch);
    const url = `${appConfig.api1111}/ProveListgetByKeyword`;

    try {
      const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
      return res as any;
    } catch (error) {
      return [];
    }
  }

  async getByConAdv(form: any): Promise<any> {
    const params = JSON.stringify(form);
    const url = `${appConfig.api1111}/ProveListgetByConAdv`;

    try {
      const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
      return res as any;
    } catch (error) {
      return [];
    }
  }

  async getProveAPI(oFunc: string, oParam: any): Promise<any> {
    const params = JSON.stringify(oParam);
    const url = `${appConfig.api1111}/${oFunc}`;

    try {
      const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
      return res as any;
    } catch (error) {
      return [];
    }
  }

  ProveVerifyCourtJudgment(params: any) {
    const url = `${appConfig.api1111}/ProveVerifyCourtJudgment`;
    return this.http.post<any>(url, params, this.httpOptions)
  }

  downloadFile(DOCUMENT_ID: string) {
    const url = `${appConfig.api1111}/downloadFile.html/${DOCUMENT_ID}`
    return this.http.get(url, { responseType: 'arraybuffer', headers: this.httpOptions.headers });
  }

  getImage(DOCUMENT_ID: string) {
    return `${appConfig.api1111}/getImage.html/${DOCUMENT_ID}`
  }

  // **********************************
  // --------- Report Servive ---------
  // **********************************

  public ILG60_00_05_001(PROVE_ID: any) {
    const params = { ProveID: PROVE_ID };
    const url = `${appConfig.apiReport}/ILG60_00_05_001.aspx`;
    return this.http
      .post(url, params, { ...this.httpOptions, responseType: "blob" })
      .map(res => res);
  }

  public ILG60_00_05_002(PROVE_ID: any) {
    const params = { ProveID: PROVE_ID };
    const url = `${appConfig.apiReport}/ILG60_00_05_002.aspx`;
    return this.http
      .post(url, params, { ...this.httpOptions, responseType: "blob" })
      .map(res => res);
  }

  public ILG60_00_05_003(PROVE_ID: any) {
    const params = { ProveID: PROVE_ID };
    const url = `${appConfig.apiReport}/ILG60_00_05_003.aspx`;
    return this.http
      .post(url, params, { ...this.httpOptions, responseType: "blob" })
      .map(res => res);
  }

}