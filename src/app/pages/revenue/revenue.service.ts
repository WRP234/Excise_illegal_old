import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { appConfig } from '../../app.config';
import { Observable } from "rxjs/Observable";
import { setZero } from 'app/config/dateFormat';
import { map } from 'rxjs/operators';
import { Mode, Action } from '../model/mode';

@Injectable()
export class RevenueService {

  constructor(private http: HttpClient) { }

  private httpOptions = {
    headers: new HttpHeaders(
      {
        'Content-Type': 'application/json'
      })
  };

  public PipeResponseRevenueDetailDelete_reverseCase(obj: Observable<any>, REVENUE_DETAIL_ID: string, FORM_DELETE: any, EVENT: string) {
    return obj.pipe(map(x => {
      x['RESPONSE_FROM'] = "REVENUE_DETAIL_SERVICE"
      x['REVENUE_DETAIL_ID'] = REVENUE_DETAIL_ID
      x['REVENUE_DETAIL_EVENT'] = EVENT
      x['REVENUE_DETAIL_FORM_DELETE'] = FORM_DELETE
      return x
    }));
  }

  public PipeResponseRevenueDetailDelete(obj: Observable<any>, REVENUE_DETAIL_ID: string, EVENT: string) {
    return obj.pipe(map(x => {
      x['RESPONSE_FROM'] = "REVENUE_DETAIL_SERVICE"
      x['REVENUE_DETAIL_ID'] = REVENUE_DETAIL_ID
      x['REVENUE_DETAIL_EVENT'] = EVENT

      return x
    }));
  }

  public PipeResponseRevenueDetailInsert(obj: Observable<any>, EVENT: string) {
    return obj.pipe(map(x => {
      x['RESPONSE_FROM'] = "REVENUE_DETAIL_SERVICE"
      x['REVENUE_DETAIL_EVENT'] = EVENT
      return x
    }));
  }

  public PipeResponse(obj: Observable<any>) {
    return obj.pipe(map(x => {
      if (x['IsSuccess'] == "True")
        return true;
      return false;
    }));
  }

  public PipeResponseIncInsert_us(obj: Observable<any>, EVENT: string) {
    return obj.pipe(map(x => {
      x['RESPONSE_FROM'] = "INC_US_SERVICE"
      x['REVENUE_DETAIL_EVENT'] = EVENT
      return x
    }));
  }

  public PipeResponseIncInsert_xcs(obj: Observable<any>) {
    return obj.pipe(map(x => {
      let Init: any = {
        IsSuccess: "False",
        INC_XCS_SERVICE_EVENT: Action.ADD,
        RESPONSE_FROM: "INC_XCS_SERVICE"
      };

      if (x['ResponseCode'] == "I0001")
        return { ...Init, IsSuccess: "True" };

      return Init;
    }));
  }

  public PipeResponseIncOnGet(obj: Observable<any>) {
    return obj.pipe(map(x => {
      if (x['ResponseCode'] == "OK")
        return x['ResponseData'];
      return null;
    }));
  }

  async requestAPI(oFunc: string, oParam: any): Promise<any> {
    const params = JSON.stringify(oParam);
    const url = `${appConfig.api1111}/${oFunc}`;

    try {
      const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
      return res as any;
    } catch (error) {
      return [];
    }
  }

  async TransactionRunninggetByCon(RunningTable, RunningOfficeCode): Promise<any> {
    let pValue = {
      "RUNNING_TABLE": RunningTable,
      "RUNNING_OFFICE_CODE": RunningOfficeCode
    }

    const params = JSON.stringify(pValue);
    const url = `${appConfig.api1111}/TransactionRunninggetByCon`;
    return await this.http.post<any>(url, params, this.httpOptions).toPromise();

  }

  async TransactionRunninginsAll(RunningOfficeId, RunningOfficeCode, RunningTable, RunningPrefix, RunningYear, RunningMonth): Promise<any> {
    let pValue = {
      "RUNNING_YEAR": RunningYear,
      "RUNNING_MONTH": RunningMonth,
      "RUNNING_OFFICE_ID": RunningOfficeId,
      "RUNNING_OFFICE_CODE": RunningOfficeCode,
      "RUNNING_TABLE": RunningTable,
      "RUNNING_PREFIX": RunningPrefix
    }

    const params = JSON.stringify(pValue);
    const url = `${appConfig.api1111}/TransactionRunninginsAll`;
    return await this.http.post<any>(url, params, this.httpOptions).toPromise();
  }

  async TransactionRunningupdByCon(RUNNING_ID): Promise<any> {
    const params = { RUNNING_ID };
    const url = `${appConfig.api1111}/TransactionRunningupdByCon`;
    return await this.http.post<any>(url, params, this.httpOptions).toPromise();

  }

  async InquiryBank(): Promise<any> {
    const form = {
      "SystemId": "WSS",
      "UserName": "wss001",
      "Password": "123456",
      "IpAddress": "10.1.1.1",
      "RequestData": {
      }
    }
    const params = JSON.stringify(form);
    const url = `${appConfig.XCS_DNS_SERVICE}/rdb/InquiryBank`;
    return await this.http.post<any>(url, params, this.httpOptions).toPromise();
  }

  public ILG60_00_07_001(RevenueID: any) {
    const params = { RevenueID: RevenueID };
    const url = `${appConfig.apiReport}/ILG60_00_07_001.aspx`;
    return this.http
      .post(url, params, { ...this.httpOptions, responseType: "blob" })
      .map(res => res);
  }

  /** Observable rx*/
  RevenuegetByCon(form: any): Observable<any> {
    return this.http.post(`${appConfig.api1111}/RevenuegetByCon`, form);
  }

  RevenueComparegetByCreate(form: any): Observable<any> {
    return this.http.post(`${appConfig.api1111}/RevenueComparegetByCreate`, form);
  }

  RevenueCourtDetailgetByCreate(form: any): Observable<any> {
    return this.http.post(`${appConfig.api1111}/RevenueCourtDetailgetByCreate`, form);
  }

  RevenueComparegetByCon(form: any): Observable<any> {
    return this.http.post(`${appConfig.api1111}/RevenueComparegetByCon`, form);
  }

  RevenueCourtgetByCon(form: any): Observable<any> {
    return this.http.post(`${appConfig.api1111}/RevenueCourtgetByCon`, form);
  }

  RevenueinsAll(form: any): Observable<any> {
    return this.http.post(`${appConfig.api1111}/RevenueinsAll`, form);
  }

  RevenueupdDelete(REVENUE_ID: any): Observable<any> {
    const form = { REVENUE_ID }
    return this.http.post(`${appConfig.api1111}/RevenueupdDelete`, form);
  }

  RevenueupdByCon(form: any): Observable<any> {
    return this.http.post(`${appConfig.api1111}/RevenueupdByCon`, form);
  }

  RevenueCompareStatus(form: any): Observable<any> {
    return this.http.post(`${appConfig.api1111}/RevenueCompareStatus`, form);
  }

  RevenuePaymentupdByCon(form: any): Observable<any> {
    return this.http.post(`${appConfig.api1111}/RevenuePaymentupdByCon`, form);
  }

  RevenueDetailupdDelete(form: any): Observable<any> {
    const res = this.http.post(`${appConfig.api1111}/RevenueDetailupdDelete`, form);
    return this.PipeResponseRevenueDetailDelete(res, form['REVENUE_DETAIL_ID'], Action.DELETE);
  }

  RevenueDetailupdDelete_forReverseCase(form: any, formDelete: any): Observable<any> {
    const res = this.http.post(`${appConfig.api1111}/RevenueDetailupdDelete`, form);
    return this.PipeResponseRevenueDetailDelete_reverseCase(res, form['REVENUE_DETAIL_ID'], formDelete, Action.DELETE);
  }

  RevenueDetailinsAll(form: any): Observable<any> {
    const res = this.http.post(`${appConfig.api1111}/RevenueDetailinsAll`, form);
    return this.PipeResponseRevenueDetailInsert(res, Action.ADD);
  }

  IncPaymentListinsAll(form: any): Observable<any> {
    const res = this.http.post(`${appConfig.api1111}/IncPaymentListinsAll`, form);
    return this.PipeResponseIncInsert_us(res, Action.ADD);

  }

  IncPaymentListUpdDelete(REVENUE_ID: any): Observable<any> {
    const form = { REVENUE_ID: REVENUE_ID }
    return this.http.post(`${appConfig.api1111}/IncPaymentListUpdDelete`, form);
  }

  async IncPaymentListGetByCon(REVENUE_ID: any): Promise<any> {
    const form = { REVENUE_ID: REVENUE_ID }
    return await this.http.post(`${appConfig.api1111}/IncPaymentListGetByCon`, form).toPromise();
  }

  RevenueReturnupdREFno(REVENUE_ID: any): Observable<any> {
    const form = {
      "RECEIVE_DATE": "",
      "RECEIVE_REF_NO": "",
      "REVENUE_ID": REVENUE_ID
    }
    return this.http.post(`${appConfig.api1111}/RevenueReturnupdREFno`, form);
  }

  RevenueReturnUpdateREFno(form: any): Observable<any> {
    return this.http.post(`${appConfig.api1111}/RevenueReturnUpdateREFno`, form);
  }

  IncFrm8000(revenue_code: string, offcode: any, penaltyList: any, paymentTypeList: any): Observable<any> {
    const d = new Date();
    const currDate = `${d.getFullYear()}${setZero(d.getMonth())}${setZero(d.getDate())}`;
    const form = {
      "systemid": "PNT",
      "username": " PNT_System",
      "password": "123456",
      "ipaddress": "10.11.1.10",
      "requestData": {
        "docRefNo": revenue_code,
        "offcode": offcode,
        "offcodeOwn": offcode,
        "refDate": currDate,
        "penaltyList": penaltyList,
        "paymentTypeList": paymentTypeList
      }
    }

    const res = this.http.post(`${appConfig.XCS_DNS_SERVICE}/inc/IncFrm8000`, form);
    return this.PipeResponseIncInsert_xcs(res);
  }

  IncFri8100(revenue_code: string): Observable<any> {
    const form = {
      "Systemid": "PNT",
      "Username": " PNT_System",
      "Password": "123456",
      "Ipaddress": "10.11.1.1",
      "RequestData": {
        "DocRefNo": revenue_code
      }
    }

    const res = this.http.post(`${appConfig.XCS_DNS_SERVICE}/inc/IncFri8100`, form);
    return this.PipeResponseIncOnGet(res);
  }

  RevenueSearchStatus1(OFFICE_CODE: any): Observable<any> {
    const form = { DELIVERY_OFFICE_CODE: OFFICE_CODE }
    return this.http.post(`${appConfig.api1111}/RevenueSearchStatus1`, form);
  }

  public MasProductGroupgetByCon(params?: any)
    : Observable<any[]> {
    params = params ? params : { PRODUCT_GROUP_ID: "", PRODUCT_GROUP_CODE: "" };
    const url = `${appConfig.api1111}/MasProductGroupgetByCon`;
    const res = this.http.post<any[]>(url, params);
    return res;
  }

}
