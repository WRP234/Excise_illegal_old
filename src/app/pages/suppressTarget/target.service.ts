import { Injectable, HostListener } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { appConfig } from '../../app.config'; 

@Injectable()
export class TargetService {

    I18N_VALUES = {
        weekdays: ['อ.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'],
        months: ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม']
      };

    constructor(private http: HttpClient) { }

        private httpOptions = {
        headers: new HttpHeaders(
          {
            'Content-Type': 'application/json'
          })
        };

      public print(targetCode: any) {
        const params = { ID: targetCode };
        const url = `${appConfig.apiReport}/SuppressTarget.aspx`;
        return this.http
          .post(url, params, { ...this.httpOptions, responseType: "blob" })
          .map(res => res);
      }

      TargetListgetByKeyword(TEXT_SEARCH) {
        const url = `${appConfig.api1111}/TargetListgetByKeyword`;
        return this.http.post<any>(url, TEXT_SEARCH, this.httpOptions);
      }

      async TargetListgetByKeywords(oFunc: string, form: any): Promise<any> {
        const params = JSON.stringify(form);
        const url = `${appConfig.api1111}/${oFunc}`;
        const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
        return res as any;
      }

      TargetgetByCon(ITEM_ID) {
        const url = `${appConfig.api1111}/TargetgetByCon`;
        return this.http.post<any>(url, ITEM_ID, this.httpOptions);
      }

      async TargetgetByCons(oFunc: string, form: any): Promise<any> {
        const params = JSON.stringify(form);
        const url = `${appConfig.api1111}/${oFunc}`;
        const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
        return res as any;
      }

      async getByKeyword(oFunc: string, form: any): Promise<any> {
        const params = JSON.stringify(form);
        const url = `${appConfig.api1111}/${oFunc}`;
    
        try {
          const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
          return res as any;
        } catch (error) {
          return [];
        }
      }

      async TargetListgetByConAdv(oFunc: string, form: any): Promise<any> {
        const params = JSON.stringify(form);
        const url = `${appConfig.api1111}/${oFunc}`;
    
        try {
          const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
          return res as any;
        } catch (error) {
          return [];
        }
      }

    
      async getByCon(oFunc: string, form: any): Promise<any> {
        const params = JSON.stringify(form);
        const url = `${appConfig.api1111}/${oFunc}`;
    
        try {
          const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
          return res as any;
        } catch (error) {
          return [];
        }
      }

      async MasOfficegetByCon(oFunc: string, form: any): Promise<any> {
        const params = JSON.stringify(form);
        const url = `${appConfig.api2222}/${oFunc}`;
    
        try {
          const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
          return res as any;
        } catch (error) {
          return [];
        }
      }

      async transectionGet(oFunc: string, form: any): Promise<any> {
        const params = JSON.stringify(form);
        const url = `${appConfig.api1111}/${oFunc}`;
    
        try {
          const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
          return res as any;
        } catch (error) {
          return [];
        }
      }

      async transectionIns(oFunc: string, form: any): Promise<any> {
        const params = JSON.stringify(form);
        const url = `${appConfig.api1111}/${oFunc}`;
    
        try {
          const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
          return res as any;
        } catch (error) {
          return [];
        }
      }

      async transectionUpd(oFunc: string, form: any): Promise<any> {
        const params = JSON.stringify(form);
        const url = `${appConfig.api1111}/${oFunc}`;
    
        try {
          const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
          return res as any;
        } catch (error) {
          return [];
        }
      }


      async MasProductGroupgetByCon(oFunc: string, form: any): Promise<any> {
        const params = JSON.stringify(form);
        const url = `${appConfig.api1111}/${oFunc}`;
    
        try {
          const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
          return res as any;
        } catch (error) {
          return [];
        }
      }

      async TargetDetailgetByCon(oFunc: string, form: any): Promise<any> {
        const params = JSON.stringify(form);
        const url = `${appConfig.api1111}/${oFunc}`;
    
        try {
          const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
          return res as any;
        } catch (error) {
          return [];
        }
      }

      async TargetinsAll(oFunc: string, form: any): Promise<any> {
        const params = JSON.stringify(form);
        const url = `${appConfig.api1111}/${oFunc}`;
    
        try {
          const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
          return res as any;
        } catch (error) {
          return [];
        }
      }

      async IsSentTargetupdByCon(oFunc: string, form: any): Promise<any> {
        const params = JSON.stringify(form);
        const url = `${appConfig.api1111}/${oFunc}`;
    
        try {
          const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
          return res as any;
        } catch (error) {
          return [];
        }
      }

      async TargetupdDelete(oFunc: string, form: any): Promise<any> {
        const params = JSON.stringify(form);
        const url = `${appConfig.api1111}/${oFunc}`;
    
        try {
          const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
          return res as any;
        } catch (error) {
          return [];
        }
      }

      async TargetItemDetailupdByCon(oFunc: string, form: any): Promise<any> {
        const params = JSON.stringify(form);
        const url = `${appConfig.api1111}/${oFunc}`;
    
        try {
          const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
          return res as any;
        } catch (error) {
          return [];
        }
      }

      
}