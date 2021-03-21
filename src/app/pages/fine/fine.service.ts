import { Injectable, isDevMode } from "@angular/core";
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Compare } from './compare';
import { CompareDetail } from './compareDetail';
import { appConfig } from '../../app.config';
import { Arrest } from '../model/arrest';
import { Lawsuit } from '../model/lawsuit-model';
import { ICompareIns, ICompareMistreat, IRateMistreat } from './condition-model';
import { Observable } from 'rxjs/Observable';
import { map } from "rxjs/operators";
import { updDelete } from '././compare_document'

@Injectable()
export class FineService {

  constructor(
    private http: HttpClient,) { }
  defaultPort = '1111';
  private httpOptions = {
    headers: new HttpHeaders(
      {
        'Content-Type': 'application/json'
      })
  };

  private httpOption = {
    headers: new HttpHeaders(
      {
        'Content-Type': 'multipart/form-data'
      })
  };

  public setOfficeName(input: any[] = []) {
    console.log('return : ', input.reduce((a, c) => [...a, c.OFFICE_SHORT_NAME], []).slice(0, 10))
    return input.reduce((a, c) => [...a, c.OFFICE_SHORT_NAME], []).slice(0, 10);
  }

  public MasOfficegetByCon_forSearch(params: any): Observable<any[]> {
    const res = this.http.post(`${appConfig.api1111}/MasOfficegetByCon`, params);
    return this.PipeResponseData(res).pipe(
      map(x => isDevMode() && !x.length ? [] : this.setOfficeName(x))
    );
  }

  public MasStaffgetByCon_Search(params: any): Observable<any[]> {
    const res = this.http.post(`${appConfig.api1111}/MasStaffgetByCon`, params);
    return this.PipeResponseData(res).pipe(
      map(x => isDevMode() && !x.length ? [] : x.slice(0, 10))
    );
  }

  getImage(DOCUMENT_ID: string) {
    return `${appConfig.api1111}/getImage.html/${DOCUMENT_ID}`
  }

  // DocumentupdDelete(form: updDelete) {
  //   const url = `${appConfig.api1111}/DocumentupdDelete`;
  //   return this.http.post<any>(url, form);
  // }

  async DocumentupdDelete(oFunc: string, form: any): Promise<any> {
    const params = JSON.stringify(form);
    const url = `${appConfig.api1111}/${oFunc}`;

    try {
      const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
      return res as any;
    } catch (error) {
      return [];
    }
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

  postMethod(url: string, data: any, port: string = '1111') {
    const params = data;
    const full_url = `${appConfig[`api${port}`]}/${url}`;
    return this.http.post<any>(full_url, params, this.httpOptions).toPromise();
  }
  getByKeyword(Textsearch: any) {
    const params = Textsearch;
    params.ACCOUNT_OFFICE_CODE = localStorage.getItem('officeCode');
    const url = `${appConfig.api1111}/CompareListgetByKeyword`;
    // return this.postMethod('CompareListgetByKeyword', )
    return this.http.post<Compare[]>(url, params, this.httpOptions);
  }

  async LDPAGAuthen(oFunc: string, form: any): Promise<any> {
    const params = JSON.stringify(form);
    const url = `${appConfig.api8086}/${oFunc}`;
    const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
    return res as any;
  }

  async MasStaffgetByConAdv(oFunc: string, form: any): Promise<any> {
    const params = JSON.stringify(form);
    const url = `${appConfig.api2222}/${oFunc}`;
    const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
    return res as any;
  }

  async signaturePrint(oFunc: string, form: any): Promise<any> {
    const params = JSON.stringify(form);
    // const url = `http://192.168.160.59/ets-signer/multipart-form-sign-multi-page`;
    const url = `${appConfig.XCS_IP_ETS_SIGNER}/ets-signer/multipart-form-sign-multi-page`;
    const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
    return res as any;
  }

  async InquiryBank(oFunc: string, form: any): Promise<any> {
    const params = JSON.stringify(form);
    const url = `${appConfig.XCS_DNS_SERVICE}/rdb/InquiryBank`;
    const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
    return res as any;
  }

  async ViewImageSignatureColo(oFunc: string, form: any): Promise<any> {
    const params = JSON.stringify(form);
    // const url = `http://webtest.excise.go.th/EDRestServicesUAT/rtn/ViewImageSignature`;
    const url = `${appConfig.XCS_DNS_SERVICE}/rtn/ViewImageSignature`;
    const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
    return res as any;
  }

  async ViewImageSignature(oFunc: string, form: any): Promise<any> {
    const params = JSON.stringify(form);
    // const url = `http://192.168.3.136/EDRestServicesUAT/rtn/ViewImageSignature`;
    const url = `${appConfig.XCS_DNS_SERVICE}/rtn/ViewImageSignature`;
    const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
    return res as any;
  }

  async MultiplePage(oFunc: string, form: any): Promise<any> {
    const params = JSON.stringify(form);

    const formData = new FormData();
    form.map(async m => {
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
    const res = await this.http.post<any>(url, formData).toPromise();
    console.log("RESS : ", res)
    return res as any;
  }

  async signerMultipart(oFunc: string, form: any): Promise<any> {
    const params = JSON.stringify(form);
    // const url = `http://192.168.160.59/ets-signer/multipart-form-sign-multi-page`;
    const url = `${appConfig.XCS_IP_ETS_SIGNER}/ets-signer/multipart-form-sign-multi-page`;
    const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
    return res as any;
  }

  async signerDID(oFunc: string, form: any): Promise<any> {
    const params = JSON.stringify(form);
    // const url = `http://192.168.160.59/ets-content-management/api/rest/owcc/file/id`;
    const url = `${appConfig.XCS_IP_ETS_SIGNER}/ets-content-management/api/rest/owcc/file/id`;
    const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
    return res as any;
  }

  async ILG60_00_06_002(oFunc: string, form: any): Promise<any> {
    const params = JSON.stringify(form);
    const url = `${appConfig.apiReport}/${oFunc}`;
    const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
    return res as any;
  }

  //*****************nill_dev************** */
  //*****************staff************** */
  async MasStaffgetByCon(oFunc: string, form: any): Promise<any> {
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
    const url = `${appConfig.api1111}/${oFunc}`;

    try {
      const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
      return res as any;
    } catch (error) {
      return [];
    }
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


  async TransactionRunningupdByCon(oFunc: string, form: any): Promise<any> {
    const params = JSON.stringify(form);
    const url = `${appConfig.api1111}/${oFunc}`;
    const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
    return res as any;
  }

  // async CompareRunningCompareNo(oFunc: string, form: any): Promise<any> {
  //   const params = JSON.stringify(form);
  //   const url = `${appConfig.api1111}/${oFunc}`;
  //   const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
  //   return res as any;
  // }

  async CompareRunningCompareNo(oFunc: string, form: any): Promise<any> {
    const params = JSON.stringify(form);
    const url = `${appConfig.api1111}/${oFunc}`;

    try {
      const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
      return res as any;
    } catch (error) {
      return [];
    }
  }

  // public MasStaffgetByCon_Search(params: any): Observable<NoticeStaff[]> {
  //   const res = this.http.post(`${appConfig.api1111}/MasStaffgetByCon`, params);
  //   return this.PipeResponseData(res).pipe(
  //     map(x => isDevMode() && !x.length ? [] : x)
  //   );
  // }

  private async responsePromisModify(params: string, url: string) {
    const res = await this.http
      .post<any>(url, params, this.httpOptions)
      .toPromise();
    if (res.IsSuccess == "False") {
      return false;
    }
    return true && res;
  }

  masStaff(params) {
    const url = `${appConfig.api1111}/MasStaffgetByCon`;
    return this.http.post<any>(url, params, this.httpOptions);
  }

  async NoticeStaffupdDelete(STAFF_ID: string): Promise<any> {
    const params = { STAFF_ID };
    const url = `${appConfig.api1111}/NoticeStaffupdDelete`;
    return this.responsePromisModify(JSON.stringify(params), url);
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

  //*****************compare************** */
  async CompareDetailCheckReceriptNo(params: any): Promise<any> {
    const url = `${appConfig.api1111}/CompareDetailCheckReceriptNo`;
    return await this.http.post<any>(url, params, this.httpOptions).toPromise();
  }

  async ReceriptNoupdDelete(params: any): Promise<any> {
    const url = `${appConfig.api1111}/ReceriptNoupdDelete`;
    return await this.http.post<any>(url, params, this.httpOptions).toPromise();
  }

  async CompareCountMistreatgetByCon(oFunc: string, form: any): Promise<any> {
    const params = JSON.stringify(form);
    const url = `${appConfig.api1111}/${oFunc}`;
    const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
    return res as any;
  }

  async PersonDetailgetByPersonId(oFunc: string, form: any): Promise<any> {
    const params = JSON.stringify(form);
    const url = `${appConfig.api1119}/${oFunc}`;
    const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
    return res as any;
  }

  async ArrestgetByCon(oFunc: string, form: any): Promise<any> {
    const params = JSON.stringify(form);
    const url = `${appConfig.api1111}/${oFunc}`;
    const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
    return res as any;
  }

  // CompareCountMistreatgetByCon(PERSON_ID) {
  //   const url = `${appConfig.api1111}/CompareCountMistreatgetByCon`;
  //   return this.http.post<any>(url, PERSON_ID , this.httpOptions);
  // }

  async CompareListgetByKeyword(oFunc: string, form: any): Promise<any> {
    const params = JSON.stringify(form);
    const url = `${appConfig.api1111}/${oFunc}`;

    try {
      const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
      return res as any;
    } catch (error) {
      return [];
    }
  }

  async CompareListgetByConAdv(oFunc: string, form: any): Promise<any> {
    const params = JSON.stringify(form);
    const url = `${appConfig.api1111}/${oFunc}`;

    try {
      const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
      return res as any;
    } catch (error) {
      return [];
    }
  }

  async CompareArrestgetByIndictmentID(oFunc: string, form: any): Promise<any> {
    const params = JSON.stringify(form);
    const url = `${appConfig.api1111}/${oFunc}`;

    try {
      const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
      return res as any;
    } catch (error) {
      return [];
    }
  }

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

  async CompareinsAll(oFunc: string, form: any): Promise<any> {
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

  async CompareupdByCon(oFunc: string, form: any): Promise<any> {
    const params = JSON.stringify(form);
    const url = `${appConfig.api1111}/${oFunc}`;

    try {
      const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
      return res as any;
    } catch (error) {
      return [];
    }
  }

  async CompareupdDelete(oFunc: string, form: any): Promise<any> {
    const params = JSON.stringify(form);
    const url = `${appConfig.api1111}/${oFunc}`;

    try {
      const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
      return res as any;
    } catch (error) {
      return [];
    }
  }

  async CompareVerifyCompareNo(oFunc: string, form: any): Promise<any> {
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

  async CompareDetailupdDelete(oFunc: string, form: any): Promise<any> {
    const params = JSON.stringify(form);
    const url = `${appConfig.api1111}/${oFunc}`;

    try {
      const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
      return res as any;
    } catch (error) {
      return [];
    }
  }

  async CompareDetailPaymentinsAll(oFunc: string, form: any): Promise<any> {
    const params = JSON.stringify(form);
    const url = `${appConfig.api1111}/${oFunc}`;

    try {
      const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
      return res as any;
    } catch (error) {
      return [];
    }
  }

  async CompareDetailPaymentupdByCon(oFunc: string, form: any): Promise<any> {
    const params = JSON.stringify(form);
    const url = `${appConfig.api1111}/${oFunc}`;

    try {
      const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
      return res as any;
    } catch (error) {
      return [];
    }
  }

  async CompareDetailPaymentupdDelete(oFunc: string, form: any): Promise<any> {
    const params = JSON.stringify(form);
    const url = `${appConfig.api1111}/${oFunc}`;

    try {
      const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
      return res as any;
    } catch (error) {
      return [];
    }
  }

  async CompareDetailFineinsAll(oFunc: string, form: any): Promise<any> {
    const params = JSON.stringify(form);
    const url = `${appConfig.api1111}/${oFunc}`;

    try {
      const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
      return res as any;
    } catch (error) {
      return [];
    }
  }

  async CompareDetailFineupdByCon(oFunc: string, form: any): Promise<any> {
    const params = JSON.stringify(form);
    const url = `${appConfig.api1111}/${oFunc}`;

    try {
      const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
      return res as any;
    } catch (error) {
      return [];
    }
  }

  async CompareDetailFineupdDelete(oFunc: string, form: any): Promise<any> {
    const params = JSON.stringify(form);
    const url = `${appConfig.api1111}/${oFunc}`;

    try {
      const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
      return res as any;
    } catch (error) {
      return [];
    }
  }

  async CompareDetailStaffupdByCon(oFunc: string, form: any): Promise<any> {
    const params = JSON.stringify(form);
    const url = `${appConfig.api1111}/${oFunc}`;

    try {
      const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
      return res as any;
    } catch (error) {
      return [];
    }
  }

  async CompareDetailStaffupdDelete(oFunc: string, form: any): Promise<any> {
    const params = JSON.stringify(form);
    const url = `${appConfig.api1111}/${oFunc}`;

    try {
      const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
      return res as any;
    } catch (error) {
      return [];
    }
  }

  // async CompareCountMistreatgetByCon(oFunc: string, form: any): Promise<any> {
  //     const params = JSON.stringify(form);
  //     const url = `${appConfig.api1111}/${oFunc}`;

  //     try {
  //       const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
  //       return res as any;
  //     } catch (error) {
  //       return [];
  //     }
  //   }

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

  async ComparePaymentupdDelete(oFunc: string, form: any): Promise<any> {
    const params = JSON.stringify(form);
    const url = `${appConfig.api1111}/${oFunc}`;

    try {
      const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
      return res as any;
    } catch (error) {
      return [];
    }
  }

  // async CompareNoticegetByArrestID(oFunc: string, form: any): Promise<any> {
  //   const params = JSON.stringify(form);
  //   const url = `${appConfig.api1111}/${oFunc}`;

  //   try {
  //     const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
  //     return res as any;
  //   } catch (error) {
  //     return [];
  //   }
  // }

  async CompareNoticegetByArrestID(oFunc: string, form: any): Promise<any> {
    const params = JSON.stringify(form);
    const url = `${appConfig.api1111}/${oFunc}`;
    const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
    return res as any;
  }
  //*************************************** */

  // async getByCon(CompareID: string): Promise<any> {
  //   const params = { CompareID };
  //   const url = `${appConfig.api1111}/ComparegetByCon`;

  //   try {
  //     const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
  //     return res;
  //   } catch (error) {
  //     await alert(error);
  //   }
  // }

  // getByConAdv(form: any) {
  //   form.ACCOUNT_OFFICE_CODE = localStorage.getItem('officeCode');
  //   const params = JSON.stringify(form);
  //   console.log(params);
  //   const url = `${appConfig.api1111}/CompareListgetByConAdv`;

  //   try {
  //     console.log(this.http.post<Compare[]>(url, params, this.httpOptions));
  //     return this.http.post<Compare[]>(url, params, this.httpOptions);
  //   } catch (error) {
  //     alert(error);
  //   }

  // }

  getByCon(TEXT_SEARCH) {
    const url = `${appConfig.api1111}/ComparegetByCon`;
    return this.http.post<any>(url, TEXT_SEARCH, this.httpOptions);
  }

  getByConAdv(TEXT_SEARCH) {
    const url = `${appConfig.api1111}/CompareListgetByConAdv`;
    return this.http.post<any>(url, TEXT_SEARCH, this.httpOptions);
  }

  private async resposePromisGetList(params: string, url: string) {
    const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
    if (res.IsSuccess === false) {
      return [];
    }
    if (!res.ResponseData.length) {
      return []
    }
    return res.ResponseData
  }

}
