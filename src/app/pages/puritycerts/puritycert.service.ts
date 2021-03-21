import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { appConfig } from '../../app.config';
import { Puritycert } from './puritycert';
import { Http, } from '@angular/http';
import { Observable } from "rxjs/Observable";
import { updDelete} from './model';

@Injectable()
export class PuritycertService {

    constructor(
        private http: HttpClient,
        private _http: Http
    ) { }

    // tslint:disable-next-line:member-ordering
    private httpOptions = {
        headers: new HttpHeaders(
        {
          'Content-Type': 'application/json'
        })
    };

    private async responsePromisModify(params: string, url: string) {
        const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
        if (res.IsSuccess === 'False') {
            return false;
        }
        return true;
    }

    private async resposePromisGet(params: string, url: string) {
        const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
        if (res.IsSuccess === 'False' || !res.ResponseData.length) {
            return [];
        }
        return res.ResponseData
    }

    // async getByKeywordOnInt(): Promise<Puritycert[]> {
    //     const params = { 'Textsearch': '' };
    //     const url = `${appConfig.api1115}/PuritycertgetByKeyword`;
    //     const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
    //     console.log(res)
    //     if (res.IsSuccess === 'False') {
    //         return new Array<Puritycert>();
    //     }

    //     return res[0];
    // }

    async PuritycertListgetByKeyword(body): Promise<Puritycert[]> {
        const url = `${appConfig.api1118}/PuritycertListgetByKeyword`;
        const res = await this.http.post<any>(url, body, this.httpOptions).toPromise();
        if (res.IsSuccess === 'False') {
            return new Array<Puritycert>();
        }
        return res;
    }

    async PuritycertListByConAdv(form: any): Promise<Puritycert[]> {
    const url = `${appConfig.api1118}/PuritycertListByConAdv`;
    // return this.resposePromisGet(JSON.stringify(form), url)
    const res = await this.http.post<any>(url, JSON.stringify(form), this.httpOptions).toPromise();
    if (res.IsSuccess === 'False') {
      return new Array<Puritycert>();
    }

    return res;
  }

  async PurityinsAll(form): Promise<Puritycert[]> {
    const url = `${appConfig.api1118}/PurityinsAll`;
    const res = await this.http.post<any>(url, JSON.stringify(form), this.httpOptions).toPromise();
    // console.log(res);
    if (res.IsSuccess === 'False') {
      return new Array<Puritycert>();
    }
    return res;
  }


  async PuritycertupdByCon(form): Promise<Puritycert[]> {
    const url = `${appConfig.api1118}/PuritycertupdByCon`;
    const res = await this.http.post<any>(url, JSON.stringify(form), this.httpOptions).toPromise();
    // console.log(res);
    if (res.IsSuccess === 'False') {
      return new Array<Puritycert>();
    }
    return res;
  }

  async PuritycertByCon(body): Promise<Puritycert[]> {
    const url = `${appConfig.api1118}/PuritycertByCon`;
    const res = await this.http.post<any>(url, JSON.stringify(body), this.httpOptions).toPromise();
    if (res.IsSuccess === 'False') {
      return new Array<Puritycert>();
    }
    return res;
  }

  async PuritycertupdDelete(body): Promise<Puritycert[]> {
    const url = `${appConfig.api1118}/PuritycertupdDelete`;
    const res = await this.http.post<any>(url, JSON.stringify(body), this.httpOptions).toPromise();
    if (res.IsSuccess === 'False') {
      return new Array<Puritycert>();
    }
    return res;
  }



    ArrestinsAll(form: Puritycert): Observable<any> {
        return this.http.post(`${appConfig.api1111}/ArrestinsAll`, form);
    }


  DocumentupdDelete(form: updDelete) {
    const url = `${appConfig.api1111}/DocumentupdDelete`;
    return this.http.post(url, form);
  }


  DocumentinsAll(form: any) {
    const url = `${appConfig.api1111}/DocumentinsAll`;
    return this.http.post(url, form);
  }

  GetDocumentByCon(form: any) {
    const url = `${appConfig.api1111}/GetDocumentByCon`;
    return this.http.post(url, form);
  }


  async PuritycertStaffinsAll(body) {
    const url = `${appConfig.api1118}/PuritycertStaffinsAll`;
    const res = await this.http.post<any>(url, JSON.stringify(body), this.httpOptions).toPromise();
    return res;
  }

  async PuritycertStaffupdByCon(body) {
    const url = `${appConfig.api1118}/puritycertStaffupdByCon`;
    const res = await this.http.post<any>(url, JSON.stringify(body), this.httpOptions).toPromise();
    return res;
  }

  async PurityStaffupdDelete(body) {
    const url = `${appConfig.api1118}/PurityStaffupdDelete`;
    const res = await this.http.post<any>(url, JSON.stringify(body), this.httpOptions).toPromise();
    return res;
  }


  async TransactionRunninggetByCon(body) {
    const url = `${appConfig.api1111}/TransactionRunninggetByCon`;
    return await this.http.post<any>(url, body, this.httpOptions).toPromise();
  }


  async TransactionRunninginsAll(body) {
    const url = `${appConfig.api1111}/TransactionRunninginsAll`;
    return await this.http.post<any>(url, body, this.httpOptions).toPromise();
  }

  async TransactionRunningupdByCon(body) {
    const url = `${appConfig.api1111}/TransactionRunningupdByCon`;
    return await this.http.post<any>(url, body, this.httpOptions).toPromise();
  }

}
