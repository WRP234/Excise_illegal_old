import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { appConfig } from '../../../app.config';
import { Observable } from "rxjs/Observable";

@Injectable()
export class MasUnitService {

  constructor(private http: HttpClient) { }

  private httpOptions = {
    headers: new HttpHeaders(
      {
        'Content-Type': 'application/json'
      })
  };

  public MasProductUnitgetByConAdv(params): Observable<any[]> {
    const url = `${appConfig.api1111}/MasProductUnitgetByConAdv`;
    return this.http.post<any[]>(url, params);
  }

  public MasProductGroupgetByCon(params): Observable<any[]> {
    const url = `${appConfig.api1111}/MasProductGroupgetByCon`;
    return this.http.post<any[]>(url, params);
  }

  public MasProductUnitgetByConformas(params): Observable<any> {
    const p = { UNIT_ID: params }
    const url = `${appConfig.api1111}/MasProductUnitgetByConformas`;
    return this.http.post<any[]>(url, p);
  }

  public MasProductUnitinsAll(params): Observable<any> {
    const url = `${appConfig.api1111}/MasProductUnitinsAll`;
    return this.http.post<any[]>(url, params);
  }

  public MasProductUnitupdAll(params): Observable<any> {
    const url = `${appConfig.api1111}/MasProductUnitupdAll`;
    return this.http.post<any[]>(url, params);
  }

  public MasProductUnitupdDelete(params): Observable<any> {
    const url = `${appConfig.api1111}/MasProductUnitupdDelete`;
    return this.http.post<any[]>(url, params);
  }

  public MasProductUnitMappinginsAll(params): Observable<any> {
    const url = `${appConfig.api1111}/MasProductUnitMappinginsAll`;
    return this.http.post<any[]>(url, params);
  }

  public MasProductUnitMappingupdAll(params): Observable<any> {
    const url = `${appConfig.api1111}/MasProductUnitMappingupdAll`;
    return this.http.post<any[]>(url, params);
  }

  public MasProductUnitMappingupdDelete(params): Observable<any> {
    const url = `${appConfig.api1111}/MasProductUnitMappingupdDelete`;
    return this.http.post<any[]>(url, params);
  }


}
