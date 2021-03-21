import { Injectable } from '@angular/core';
import { HttpService } from 'app/core/http.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { appConfig } from 'app/app.config';

@Injectable()
export class InvestgateMasSuspectService {
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

  async InvestigateMasSuspectgetByKeyword(TextSearch: any) {
    const params = TextSearch === '' ? { 'TextSearch': '' } : TextSearch;
    const url = `${appConfig.api1121}/InvestigateMasSuspectgetByKeyword`;
    return await this.httpClient.post<any>(url, params, this.httpOptions).toPromise();
  }

  async InvestigateMasSuspectgetByConAdv(form: any) {
    const params = form;
    const url = `${appConfig.api1121}/InvestigateMasSuspectgetByConAdv`;
    return await this.httpClient.post<any>(url, params, this.httpOptions).toPromise();
  }

  async InvestigateMasSuspectgetByCon(SuspectID: string) {
    const params = { SuspectID };
    const url = `${appConfig.api1121}/InvestigateMasSuspectgetByCon`;
    return await this.httpClient.post<any>(url, params, this.httpOptions).toPromise();
  }

  InvestigateMasSuspectinsAll(suspect: any) {
    const params = suspect;
    const url = `${appConfig.api1121}/InvestigateMasSuspectinsAll`;
    return this.http.post(url, params).map(x => x.json());
  }

  InvestigateMasSuspectupdByCon(suspect: any) {
    const params = suspect;
    const url = `${appConfig.api1121}/InvestigateMasSuspectupdByCon`;
    return this.http.post(url, params).map(x => x.json());
  }
}
