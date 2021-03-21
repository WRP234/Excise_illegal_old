import { Injectable ,isDevMode} from '@angular/core';
import { appConfig } from "../../app.config";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { updDelete } from './reduction_document'
import { map } from "rxjs/operators";
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ReductionService {

    constructor(private http: HttpClient) { }

    private httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

    async AdjustCompareListgetByKeyword(oFunc: string, form: any): Promise<any> {
        const params = JSON.stringify(form);
        const url = `${appConfig.api1111}/${oFunc}`;
        const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
        return res as any;
    }

    async InquiryBank(oFunc: string, form: any): Promise<any> {
        const params = JSON.stringify(form);
        const url = `${appConfig.XCS_DNS_SERVICE}/rdb/InquiryBank`;
        const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
        return res as any;
    }

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

    async CompareDetailupdByCon(oFunc: string, form: any): Promise<any> {
      const params = JSON.stringify(form);
      const url = `${appConfig.api1111}/${oFunc}`;
  
      try {
        const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
        return res as any;
      } catch (error) {
        return [];
      }
    }
    
    async MultiplePage(oFunc: string, form: any): Promise<any> {
      const params = JSON.stringify(form);
      
      const formData = new FormData();
      form.map(async m=>{
        formData.append('pdfFile', m.pdfFile);
        formData.append('textFile', m.textFile);
        formData.append('saveFile', m.saveFile);
        formData.append('docName', m.docName);
        formData.append('docTitle', m.docTitle);
        formData.append('docAccount', m.docAccount);
        formData.append('docType', m.docType);
        formData.append('id', m.id);
        formData.append('system', m.system);
        formData.append('officeCode', m.officeCode);
        formData.append('fileType', m.fileType);
        formData.append('sendMail', m.sendMail);
        formData.append('signDataList', JSON.stringify(m.signDataList));
      })
  
      // const url = `http://192.168.160.59/ets-signer/api/signPdf/MultiplePage`;
      const url = `${appConfig.XCS_IP_ETS_SIGNER}/ets-signer/api/signPdf/MultiplePage`;
      const res = await this.http.post<any>(url, formData ).toPromise();
      console.log("RESS : ",res)
      return res as any;
    }

    async TransactionRunninggetByCon(oFunc: string, form: any): Promise<any> {
      const params = JSON.stringify(form);
      const url = `${appConfig.api1111}/${oFunc}`;
      const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
      return res as any;
    }
  
    async TransactionRunninginsAll(oFunc: string, form: any): Promise<any> {
      const params = JSON.stringify(form);
      const url = `${appConfig.api1111}/${oFunc}`;
      const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
      return res as any;
    }
  
    async CompareDetailupdDelete(oFunc: string, form: any): Promise<any> {
      const params = JSON.stringify(form);
      const url = `${appConfig.api1111}/${oFunc}`;
      const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
      return res as any;
    }
  
    async TransactionRunningupdByCon(oFunc: string, form: any): Promise<any> {
      const params = JSON.stringify(form);
      const url = `${appConfig.api1111}/${oFunc}`;
      const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
      return res as any;
    }

    async CompareNoticegetByArrestID(oFunc: string, form: any): Promise<any> {
        const params = JSON.stringify(form);
        const url = `${appConfig.api1111}/${oFunc}`;
    
        try {
          const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
          return res as any;
        } catch (error) {
          return [];
        }
      }

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

    async ComparePaymentinsAll(oFunc: string, form: any): Promise<any> {
        const params = JSON.stringify(form);
        const url = `${appConfig.api1111}/${oFunc}`;

        try {
        const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
        return res as any;
        } catch (error) {
        return [];
        }
    }

    async CompareDetailinsAll(oFunc: string, form: any): Promise<any> {
        const params = JSON.stringify(form);
        const url = `${appConfig.api1111}/${oFunc}`;

        try {
        const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
        return res as any;
        } catch (error) {
        return [];
        }
    }

    async CompareDetailStaffinsAll(oFunc: string, form: any): Promise<any> {
        const params = JSON.stringify(form);
        const url = `${appConfig.api1111}/${oFunc}`;

        try {
        const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
        return res as any;
        } catch (error) {
        return [];
        }
    }

    async AdjustCompareListgetByConAdv(oFunc: string, form: any): Promise<any> {
        const params = JSON.stringify(form);
        const url = `${appConfig.api1111}/${oFunc}`;
        const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
        return res as any;
    }

    //////////////////////////////manage/////////////////////////////////////
    async ComparegetByCon(oFunc: string, form: any): Promise<any> {
        const params = JSON.stringify(form);
        const url = `${appConfig.api1111}/${oFunc}`;

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
    async AdjustCompareArrestgetByIndictmentID(oFunc: string, form: any): Promise<any> {
        const params = JSON.stringify(form);
        const url = `${appConfig.api1111}/${oFunc}`;

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

    ReductionReport(RequestBribeID) {
        const params = { RequestBribeID };
        const url = `${appConfig.apiReport}/ILG60_00_09_001.aspx`;
        return this.http.post(url, params, { ...this.httpOptions, responseType: 'blob' })
            .map(x => x)
    }
    ReductionReport2(RequestBribeID) {
        const params = { RequestBribeID };
        const url = `${appConfig.apiReport}/ILG60_00_09_002.aspx`;
        return this.http.post(url, params, { ...this.httpOptions, responseType: 'blob' })
            .map(x => x)
    }
    ReductionReport3(RequestBribeID) {
        const params = { RequestBribeID };
        const url = `${appConfig.apiReport}/ILG60_00_09_003.aspx`;
        return this.http.post(url, params, { ...this.httpOptions, responseType: 'blob' })
            .map(x => x)
    }
    ReductionReport4(RequestBribeID) {
        const params = { RequestBribeID };
        const url = `${appConfig.apiReport}/ILG60_00_09_004.aspx`;
        return this.http.post(url, params, { ...this.httpOptions, responseType: 'blob' })
            .map(x => x)
    }
}
