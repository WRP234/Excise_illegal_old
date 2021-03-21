import { Injectable, isDevMode } from "@angular/core";
import { appConfig } from "../../app.config";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { updDelete } from './reward_document'
import { Observable } from 'rxjs/Observable';
import { map } from "rxjs/operators";

@Injectable()
export class RewardService {

    constructor(private http: HttpClient) { }

    private httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

    public MasStaffgetByCon_Search(params: any): Observable<any[]> {
        const res = this.http.post(`${appConfig.api1111}/MasStaffgetByCon`, params);
        return this.PipeResponseData(res).pipe(
          map(x => isDevMode() && !x.length ? [] : x.slice(0, 10))
        );
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

    async RequestListgetByKeyword(oFunc: string, form: any): Promise<any> {
        const params = JSON.stringify(form);
        const url = `${appConfig.api1122}/${oFunc}`;
        const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
        return res as any;
    }

    async RequestListgetByConAdv(oFunc: string, form: any): Promise<any> {
        const params = JSON.stringify(form);
        const url = `${appConfig.api1122}/${oFunc}`;
        const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
        return res as any;
    }

    //////////////////////////////manage/////////////////////////////////////
    async MasOfficegetByCon(oFunc: string, form: any): Promise<any> {
      const params = JSON.stringify(form);
      const url = `${appConfig.api1111}/${oFunc}`;
  
      try {
        const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
        return res as any;
      } catch (error) {
        return [];
      }
    }

    async RequestBribeinsAll(oFunc: string, form: any): Promise<any> {
        const params = JSON.stringify(form);
        const url = `${appConfig.api1122}/${oFunc}`;
    
        try {
          const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
          return res as any;
        } catch (error) {
          return [];
        }
      }

      // async TransactionRunninggetByCon(oFunc: string, form: any): Promise<any> {
      //   const params = JSON.stringify(form);
      //   const url = `${appConfig.api1111}/${oFunc}`;
    
      //   try {
      //     const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
      //     return res as any;
      //   } catch (error) {
      //     return [];
      //   }
      // }

      async TransactionRunninggetByCon(oFunc: string, form: any): Promise<any> {
        const params = JSON.stringify(form);
        const url = `${appConfig.api1111}/${oFunc}`;
        const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
        return res as any;
      }

      // async TransactionRunninginsAll(oFunc: string, form: any): Promise<any> {
      //   const params = JSON.stringify(form);
      //   const url = `${appConfig.api1111}/${oFunc}`;
    
      //   try {
      //     const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
      //     return res as any;
      //   } catch (error) {
      //     return [];
      //   }
      // }

      async TransactionRunninginsAll(oFunc: string, form: any): Promise<any> {
        const params = JSON.stringify(form);
        const url = `${appConfig.api1111}/${oFunc}`;
        const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
        return res as any;
      }

      // async TransactionRunningupdByCon(oFunc: string, form: any): Promise<any> {
      //   const params = JSON.stringify(form);
      //   const url = `${appConfig.api1111}/${oFunc}`;
    
      //   try {
      //     const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
      //     return res as any;
      //   } catch (error) {
      //     return [];
      //   }
      // }

      async TransactionRunningupdByCon(oFunc: string, form: any): Promise<any> {
        const params = JSON.stringify(form);
        const url = `${appConfig.api1111}/${oFunc}`;
        const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
        return res as any;
      }

    async RequestBribeRewardinsAll(oFunc: string, form: any): Promise<any> {
        const params = JSON.stringify(form);
        const url = `${appConfig.api1122}/${oFunc}`;
    
        try {
          const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
          return res as any;
        } catch (error) {
          return [];
        }
      }

    // async RequestCommandinsAll(oFunc: string, form: any): Promise<any> {
    //     const params = JSON.stringify(form);
    //     const url = `${appConfig.api1122}/${oFunc}`;
    
    //     try {
    //       const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
    //       return res as any;
    //     } catch (error) {
    //       return [];
    //     }
    //   }
    
    async RequestCommandinsAll(oFunc: string, form: any): Promise<any> {
        const params = JSON.stringify(form);
        const url = `${appConfig.api1122}/${oFunc}`;
        const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
        return res as any;
      }

    async RequestRewardStaffinsAll(oFunc: string, form: any): Promise<any> {
        const params = JSON.stringify(form);
        const url = `${appConfig.api1122}/${oFunc}`;
        const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
        return res as any;
      }

    async RequestBribeStaffinsAll(oFunc: string, form: any): Promise<any> {
        const params = JSON.stringify(form);
        const url = `${appConfig.api1122}/${oFunc}`;
        const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
        return res as any;
      }

    async RequestRewardStaffupdDelete(oFunc: string, form: any): Promise<any> {
        const params = JSON.stringify(form);
        const url = `${appConfig.api1122}/${oFunc}`;
        const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
        return res as any;
      }

    async RequestBribeStaffupdDelete(oFunc: string, form: any): Promise<any> {
        const params = JSON.stringify(form);
        const url = `${appConfig.api1122}/${oFunc}`;
        const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
        return res as any;
      }

    async RequestRewardupdByCon(oFunc: string, form: any): Promise<any> {
      const params = JSON.stringify(form);
      const url = `${appConfig.api1122}/${oFunc}`;
      const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
      return res as any;
    }

    async RequestBribeupdByCon(oFunc: string, form: any): Promise<any> {
      const params = JSON.stringify(form);
      const url = `${appConfig.api1122}/${oFunc}`;
      const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
      return res as any;
    }

    async RequestRewardinsAll(oFunc: string, form: any): Promise<any> {
        const params = JSON.stringify(form);
        const url = `${appConfig.api1122}/${oFunc}`;
    
        try {
          const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
          return res as any;
        } catch (error) {
          return [];
        }
      }

    async RequestBribeupdDelete(oFunc: string, form: any): Promise<any> {
        const params = JSON.stringify(form);
        const url = `${appConfig.api1122}/${oFunc}`;
    
        try {
          const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
          return res as any;
        } catch (error) {
          return [];
        }
      }

    async RequestRewardupdDelete(oFunc: string, form: any): Promise<any> {
        const params = JSON.stringify(form);
        const url = `${appConfig.api1122}/${oFunc}`;
    
        try {
          const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
          return res as any;
        } catch (error) {
          return [];
        }
      }

    async RequestCommandupdDelete(oFunc: string, form: any): Promise<any> {
        const params = JSON.stringify(form);
        const url = `${appConfig.api1122}/${oFunc}`;
    
        try {
          const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
          return res as any;
        } catch (error) {
          return [];
        }
      }


    async AdjustComparegetByCon(oFunc: string, form: any): Promise<any> {
        const params = JSON.stringify(form);
        const url = `${appConfig.api1111}/${oFunc}`;
    
        try {
          const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
          return res as any;
        } catch (error) {
          return [];
        }
      }
    // async RequestArrestLawsuitProveComparegetByCon(oFunc: string, form: any): Promise<any> {
    //     const params = JSON.stringify(form);
    //     const url = `${appConfig.api1122}/${oFunc}`;

    //     try {
    //     const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
    //     return res as any;
    //     } catch (error) {
    //     return [];
    //     }
    // }

    async RequestArrestLawsuitProveComparegetByCon(oFunc: string, form: any): Promise<any> {
      const params = JSON.stringify(form);
        const url = `${appConfig.api1122}/${oFunc}`;
      const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
      return res as any;
    }

    // async ComparegetByCon(oFunc: string, form: any): Promise<any> {
    //   const params = JSON.stringify(form);
    //   const url = `${appConfig.api1111}/${oFunc}`;
  
    //   try {
    //     const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
    //     return res as any;
    //   } catch (error) {
    //     return [];
    //   }
    // }

    async ComparegetByCon(oFunc: string, form: any): Promise<any> {
      const params = JSON.stringify(form);
        const url = `${appConfig.api1111}/${oFunc}`;
      const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
      return res as any;
    }
    

    async RequestBribegetByCon(oFunc: string, form: any): Promise<any> {
        const params = JSON.stringify(form);
        const url = `${appConfig.api1122}/${oFunc}`;

        try {
        const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
        return res as any;
        } catch (error) {
        return [];
        }
    }

    async RequestRewardgetByCon(oFunc: string, form: any): Promise<any> {
        const params = JSON.stringify(form);
        const url = `${appConfig.api1122}/${oFunc}`;

        try {
        const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
        return res as any;
        } catch (error) {
        return [];
        }
    }

    async RequestStaffListgetByCon(oFunc: string, form: any): Promise<any> {
        const params = JSON.stringify(form);
        const url = `${appConfig.api1122}/${oFunc}`;

        try {
        const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
        return res as any;
        } catch (error) {
        return [];
        }
    }
    
    getImage(DOCUMENT_ID: string) {
    return `${appConfig.api1111}/getImage.html/${DOCUMENT_ID}`
    }

    DocumentupdDelete(form: updDelete) {
        const url = `${appConfig.api1111}/DocumentupdDelete`;
        return this.http.post<any>(url, form);
    }

    GetDocumentByCon(DOCUMENT_TYPE, REFERENCE_CODE) {
        const form = { DOCUMENT_TYPE, REFERENCE_CODE }
        const url = `${appConfig.api1111}/GetDocumentByCon`;
        return this.http.post<any>(url, form);
    }

    async DocumentinsAll(form: any) {
        const url = `${appConfig.api1111}/DocumentinsAll`;
        //return this.responsePromiseGetWithoutStatus(form, url)
        return await this.http.post<any>(url, form).toPromise();
    }

    downloadFile(DOCUMENT_ID: string) {
        const url = `${appConfig.api1111}/downloadFile.html/${DOCUMENT_ID}`
        return this.http.get(url, { responseType: 'arraybuffer', headers: this.httpOptions.headers });
    }

    RewardReport08_001(RequestBribeID) {
        const params = { RequestBribeID };
        const url = `${appConfig.apiReport}/ILG60_00_08_001.aspx`;
        return this.http.post(url, params, { ...this.httpOptions, responseType: 'blob' })
            .map(x => x)

    }
    RewardReport08_002(RequestBribeID) {
        const params = { RequestBribeID };
        const url = `${appConfig.apiReport}/ILG60_00_08_002.aspx`;
        return this.http.post(url, params, { ...this.httpOptions, responseType: 'blob' })
            .map(x => x)

    }
    RewardReport09_001(RequestBribeID) {
        const params = { RequestBribeID };
        const url = `${appConfig.apiReport}/ILG60_00_09_001.aspx`;
        return this.http.post(url, params, { ...this.httpOptions, responseType: 'blob' })
            .map(x => x)

    }
    RewardReport09_002(RequestBribeID) {
        const params = { RequestBribeID };
        const url = `${appConfig.apiReport}/ILG60_00_09_002.aspx`;
        return this.http.post(url, params, { ...this.httpOptions, responseType: 'blob' })
            .map(x => x)

    }
    RewardReport09_003(RequestBribeID) {
        const params = { RequestBribeID };
        const url = `${appConfig.apiReport}/ILG60_00_09_003.aspx`;
        return this.http.post(url, params, { ...this.httpOptions, responseType: 'blob' })
            .map(x => x)

    }
    RewardReport09_004(RequestBribeID) {
        const params = { RequestBribeID };
        const url = `${appConfig.apiReport}/ILG60_00_09_004.aspx`;
        return this.http.post(url, params, { ...this.httpOptions, responseType: 'blob' })
            .map(x => x)

    }
}
