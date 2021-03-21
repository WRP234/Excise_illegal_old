import { Injectable } from '@angular/core';
import { HttpService } from 'app/core/http.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { appConfig } from 'app/app.config';

@Injectable()
export class InvestgateMasLawbreakerService {
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

  async InvestigateMasLawbreakergetByKeyword(TextSearch: any) {
    const params = TextSearch === '' ? { 'TextSearch': '' } : TextSearch;
    const url = `${appConfig.api1121}/InvestigateMasLawbreakergetByKeyword`;
    return await this.httpClient.post<any>(url, params, this.httpOptions).toPromise();
  }

  async InvestigateMasLawbreakergetByConAdv(form: any) {
    const params = form;
    const url = `${appConfig.api1121}/InvestigateMasLawbreakergetByConAdv`;
    return await this.httpClient.post<any>(url, params, this.httpOptions).toPromise();
  }

  async InvestigateMasLawbreakergetByCon(LawbreakerID: string) {
    const params = { LawbreakerID };
    const url = `${appConfig.api1121}/InvestigateMasLawbreakergetByCon`;
    return await this.httpClient.post<any>(url, params, this.httpOptions).toPromise();
  }

  InvestigateMasLawbreakerupdByCon(lawbreaker: any) {
    const params = lawbreaker;
    const url = `${appConfig.api1121}/InvestigateMasLawbreakerupdByCon`;
    return this.http.post(url, params).map(x => x.json());
  }

}
