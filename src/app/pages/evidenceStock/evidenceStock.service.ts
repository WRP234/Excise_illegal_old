import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { appConfig } from '../../app.config';
import { Observable } from "rxjs/Observable";

@Injectable()
export class EvidenceStockService {

  constructor(
    private http: HttpClient
  ) { }

  private httpOptions = {
    headers: new HttpHeaders(
      {
        'Content-Type': 'application/json'
      })
  };

  async getByConAdv(form: any): Promise<any> {
    const params = JSON.stringify(form);
    const url = `${appConfig.api1111}/EvidenceInventoryListCheckStock`;

    try {
      const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
      return res as any;
    } catch (error) {
      return [];
    }
  }

  async getByCon(WarehouseID: string): Promise<any> {
    const params = { WarehouseID };
    const url = `${appConfig.api1111}/EvidenceInventoryCheckStockgetByCon`;

    try {
      const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
      return res;
    } catch (error) {
      return [];
    }
  }
}
