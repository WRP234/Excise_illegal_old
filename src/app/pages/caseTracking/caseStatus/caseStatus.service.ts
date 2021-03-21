import { appConfig } from './../../../app.config';
import { PreloaderService } from './../../../shared/preloader/preloader.component';
import { Injectable, HostListener } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';


@Injectable()
export class CaseStatusService {

  constructor(private http: HttpClient,
    private preloaderService: PreloaderService) { }

  private httpOptions = {
    headers: new HttpHeaders(
      {
        'Content-Type': 'application/json'
      })
  };

  SearchByKeyword(obj: any) {
    // this.preloaderService.setShowPreloader(true);
    const params = obj;
    const url = `${appConfig.api1118}/CaseStatusListgetByKeyword`;
    return this.http.post<any>(url, params, this.httpOptions);
  }

  SearchByAdvance(obj: any) {
    const params = obj;
    const url = `${appConfig.api1118}/CaseStatusListgetByConAdv`;
    return this.http.post<any>(url, params, this.httpOptions);
  }

  MasProductgetByCon(ProductID: string) {
    const params = { ProductID: ProductID }
    const url = `${appConfig.api2222}/MasProductgetByCon`;
    return this.http.post<any>(url, params, this.httpOptions);
  }

  CaseStatusDetail(obj: any) {
    const params = obj;
    const url = `${appConfig.api1118}/CaseStatusgetByCon`;
    return this.http.post<any>(url, params, this.httpOptions);
  }

}
