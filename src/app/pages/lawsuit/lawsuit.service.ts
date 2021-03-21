import { Injectable, isDevMode } from "@angular/core";
import { appConfig } from "../../app.config";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Lawsuit } from "./models/lawsuit";
import { LawsuiteStaff } from './models/lawsuit_staff'
import { Arrest } from "../model/arrest";
import { LoaderService } from "app/core/loader/loader.service";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";
import { updDelete } from './models/lawsuit_document'

@Injectable()
export class LawsuitService {

  private httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

  constructor(
    private http: HttpClient,
    private loaderService: LoaderService
  ) { }

  public setOfficeName(input: any[] = []) {
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

  public PipeResponseData(obj: Observable<any>) {
    return obj.pipe(map(x => {
      if (x == null || x == undefined)
        return [];

      if (x['SUCCESS'] == true || "True")
        return x['RESPONSE_DATA'];

      return [];
    }));
  }

  private async responsePromisModify(params: string, url: string) {
    const res = await this.http
      .post<any>(url, params, this.httpOptions)
      .toPromise();
    if (res.IsSuccess == "False") {
      return false;
    }
    return true;
  }

  private async responsePromiseGetWithoutStatus(params: string, url: string) {
    return await this.http.post<any>(url, params, this.httpOptions).toPromise() || [];
  }

  async getByKeywordOnInt(): Promise<Lawsuit[]> {
    const params = { 'Textsearch': '' };
    const url = `${appConfig.api1111}/LawsuitgetByKeyword`;
    return this.responsePromiseGetWithoutStatus(JSON.stringify(params), url);
  }

  getByKeyword(Textsearch: any): Promise<Lawsuit[]> {
    const params = Textsearch === '' ? { 'Textsearch': '' } : Textsearch;
    const url = `${appConfig.api1111}/LawsuitgetByKeyword`;
    return this.responsePromiseGetWithoutStatus(JSON.stringify(params), url)
  }
  async LawsuitArrestGetByKeyword(Textsearch: any): Promise<Lawsuit[]> {
    let offCode = '';
    if (localStorage.getItem('officeCode'))
      offCode = localStorage.getItem('officeCode');

    if (Textsearch)
      Textsearch.ACCOUNT_OFFICE_CODE = offCode;

    const params = Textsearch === '' ? { 'TEXT_SEARCH': '', 'ACCOUNT_OFFICE_CODE': offCode } : Textsearch;
    const url = `${appConfig.api1111}/LawsuiltListgetByKeyword`;
    return this.responsePromiseGetWithoutStatus(JSON.stringify(params), url)
  }

  async LawsuitgetByConAdv(form: any): Promise<Lawsuit[]> {
    const url = `${appConfig.api1111}/LawsuitgetByConAdv`;
    return this.responsePromiseGetWithoutStatus(JSON.stringify(form), url)
  }

  async LawsuitArrestGetByConAdv(form: any): Promise<Lawsuit[]> {
    const url = `${appConfig.api1111}/LawsuiltListgetByConAdv`;
    return this.responsePromiseGetWithoutStatus(JSON.stringify(form), url)
  }

  async ArrestgetByCon(ArrestCode) {
    const params = { ArrestCode: ArrestCode };
    const url = `${appConfig.api1111}/ArrestgetByCon`;
    return this.responsePromiseGetWithoutStatus(JSON.stringify(params), url);
  }

  async LawsuitArrestIndicmentDetailgetByCon(indictmentDetailID: string) {
    const params = { IndictmentDetailID: indictmentDetailID };
    const url = `${appConfig.api1111}/LawsuitArrestIndicmentDetailgetByCon`;
    return this.responsePromiseGetWithoutStatus(JSON.stringify(params), url);
  }

  LawsuitStaffupdDelete(STAFF_ID: string): Observable<any> {
    return this.http.post(`${appConfig.api1111}/LawsuitStaffupdDelete`, [STAFF_ID]);
  }

  LawsuitStaffupdAll(staff: LawsuiteStaff): Observable<any> {
    return this.http.post(`${appConfig.api1111}/LawsuitStaffupdAll`, [staff]);
  }

  public MasCourtgetByConAdv(COURT_CODE: any, COURT_NAME: any)
    : Promise<any[]> {
    const params = { COURT_CODE: COURT_CODE, COURT_NAME: COURT_NAME }
    const url = `${appConfig.api2222}/MasCourtgetByConAdv`;
    const res = this.http.post(url, params);
    return this.PipeResponseData(res).toPromise();
  }

  async InquiryBank(): Promise<any> {
    const form = {
      "SystemId": "WSS",
      "UserName": "wss001",
      "Password": "123456",
      "IpAddress": "10.1.1.1",
      "RequestData": {}
    }
    const params = JSON.stringify(form);
    const url = `${appConfig.XCS_DNS_SERVICE}/rdb/InquiryBank`;
    return await this.http.post<any>(url, params, this.httpOptions).toPromise();
  }

  async LawsuitgetByCon(LAWSUIT_ID: string): Promise<Lawsuit> {
    const params = { LAWSUIT_ID: LAWSUIT_ID };
    const url = `${appConfig.api1111}/LawsuitgetByCon`;
    try {
      const res = await this.http.post<Lawsuit>(url, params, this.httpOptions).toPromise();
      return res as any;
    } catch (error) {
      return new Lawsuit();;
    }
  }

  async LawsuiltArrestIndictmentgetByCon(IndictmentID) {
    const params = { INDICTMENT_ID: IndictmentID };
    const url = `${appConfig.api1111}/LawsuiltArrestIndictmentgetByCon`;
    return this.responsePromiseGetWithoutStatus(JSON.stringify(params), url);
  }

  async CompareMasLawgetByCon(GuiltBaseID) {
    const params = { GuiltBaseID: GuiltBaseID };
    const url = `${appConfig.api1111}/CompareMasLawgetByCon`;
    return this.responsePromiseGetWithoutStatus(JSON.stringify(params), url);
  }

  async LawsuitArrestgetByCon(IndictmentID) {
    const params = { IndictmentID: IndictmentID };
    const url = `${appConfig.api1111}/LawsuitArrestgetByCon`;
    return this.responsePromiseGetWithoutStatus(JSON.stringify(params), url);
  }

  async MasDocumentMaingetinsAll(document: any) {
    const params = document;
    const url = `${appConfig.api1111}/MasDocumentMaininsAll`;
    return this.responsePromiseGetWithoutStatus(JSON.stringify(params), url);
  }


  async MasDocumentMaingetAllString(documentType: DocumentType, ReferenceCode: string) {
    const params = { DocumentType: documentType, ReferenceCode: ReferenceCode };
    const url = `${appConfig.api1111}/MasDocumentMaingetAll`;
    return this.responsePromiseGetWithoutStatus(JSON.stringify(params), url);
  }

  async LawsuitVerifyLawsuitNo(LawsuitNo: string, OfficeCode: string, IsOutside: number, LAWSUIT_NO_YEAR: any) {
    const params = { LAWSUIT_NO: LawsuitNo, LAWSUIT_NO_YEAR: LAWSUIT_NO_YEAR, ACCOUNT_OFFICE_CODE: OfficeCode, IS_OUTSIDE: IsOutside };
    const url = `${appConfig.api1111}/LawsuitVerifyLawsuitNo`;
    return this.responsePromiseGetWithoutStatus(JSON.stringify(params), url);
  }

  LawsuitRunningLawsuitNo(OFFICE_CODE: string, YEAR: string, IS_OUTSIDE: string): Observable<any> {
    const params = { OFFICE_CODE, YEAR, IS_OUTSIDE }
    return this.http.post(`${appConfig.api1111}/LawsuitRunningLawsuitNo`, params);
  }

  LawsuitinsAll(form: any): Observable<any> {
    return this.http.post(`${appConfig.api1111}/LawsuitinsAll`, form);
  }

  LawsuiltArrestIndictmentupdArrestComplete(ARREST_ID: any): Observable<any> {
    const params = { ARREST_ID: ARREST_ID }
    return this.http.post(`${appConfig.api1111}/LawsuiltArrestIndictmentupdArrestComplete`, params);
  }

  LawsuiltArrestIndictmentupdIndictmentComplete(INDICTMENT_ID: string): Observable<any> {
    const params = { INDICTMENT_ID: INDICTMENT_ID }
    return this.http.post(`${appConfig.api1111}/LawsuiltArrestIndictmentupdIndictmentComplete`, params);
  }

  LawsuitMistreatNoupByCon(PERSON_ID: any): Observable<any> {
    const params = { PERSON_ID: PERSON_ID }
    return this.http.post(`${appConfig.api1111}/LawsuitMistreatNoupByCon`, params);
  }

  async MasStaffMaingetAll() {
    const params = {
      TEXT_SEARCH: ''
    };
    const url = `${appConfig.api2222}/MasStaffgetByCon`;
    return this.responsePromiseGetWithoutStatus(JSON.stringify(params), url);
  }

  async MasOfficeMaingetAll() {
    const params = {
      TEXT_SEARCH: ''
    };
    const url = `${appConfig.api1111}/MasOfficegetByCon`;
    return this.responsePromiseGetWithoutStatus(JSON.stringify(params), url);
  }

  async LawsuitPaymentFinegetByJudgementID(JudgementID) {
    const params = { JudgementID: JudgementID };
    const url = `${appConfig.api1111}/LawsuitPaymentFinegetByJudgementID`;
    return this.responsePromiseGetWithoutStatus(JSON.stringify(params), url);
  }

  async LawsuitJudgementupdDelete(JudgementID) {
    const params = { JudgementID: JudgementID };
    const url = `${appConfig.api1111}/LawsuitJudgementupdDelete`;
    return this.responsePromiseGetWithoutStatus(JSON.stringify(params), url);
  }

  async LawsuitJudgementupdByCon(Judgement) {
    const url = `${appConfig.api1111}/LawsuitJudgementupdByCon`;
    return this.responsePromiseGetWithoutStatus(JSON.stringify(Judgement), url);
  }

  async LawsuitPaymentFineDetailupdDelete(PaymentFineID) {
    const params = { PaymentFineID: PaymentFineID };
    const url = `${appConfig.api1111}/LawsuitPaymentFineDetailupdDelete`;
    return this.responsePromiseGetWithoutStatus(JSON.stringify(params), url);
  }

  async LawsuitPaymentFineDetailinsAll(Payment) {
    const url = `${appConfig.api1111}/LawsuitPaymentFineDetailinsAll`;
    return this.responsePromiseGetWithoutStatus(JSON.stringify(Payment), url);
  }

  async LawsuitJudgementinsAll(lawsuitForm) {
    const url = `${appConfig.api1111}/LawsuitJudgementinsAll`;
    return this.responsePromiseGetWithoutStatus(JSON.stringify(lawsuitForm), url);
  }
  async LawsuitArrestIndicmentupdByCon(IndictmentID) {
    const params = { IndictmentID: IndictmentID };
    const url = `${appConfig.api1111}/LawsuitArrestIndictmentupdByCon`;
    return this.responsePromiseGetWithoutStatus(JSON.stringify(params), url);
  }

  LawsuitupdAll(form: any): Observable<any> {
    return this.http.post(`${appConfig.api1111}/LawsuitupdAll`, form);
  }

  insStaff(staff: LawsuiteStaff): Observable<any> {
    return this.http.post(`${appConfig.api1111}/LawsuitStaffinsAll`, [staff]);
  }

  async getByArrestCon(ArrestCode: string): Promise<Arrest> {
    const params = { ArrestCode };
    const url = `${appConfig.api1111}/ArrestgetByCon`;

    try {
      const res = await this.http.post<any>(url, params, this.httpOptions).toPromise();
      return res.ResponseData as Arrest;
    } catch (error) {
      await alert(error);
    }
  }

  async ArrestLawbreakergetByCon(LawbreakerID) {
    const params = { LawbreakerID: LawbreakerID };
    const url = `${appConfig.api1111}/ArrestLawbreakergetByCon`;
    return await this.http.post<any>(url, JSON.stringify(params), this.httpOptions).toPromise();
  }

  async LawsuitupdByCon(LawsuitID, LawsuitNo) {
    const params = { LawsuitID: LawsuitID, LawsuitNo: LawsuitNo };
    const url = `${appConfig.api1111}/LawsuitupdByCon`;
    return await this.http.post<any>(url, JSON.stringify(params), this.httpOptions).toPromise();
  }

  LawsuitupdDelete(LAWSUIT_ID: any): Observable<any> {
    const params = { LAWSUIT_ID: LAWSUIT_ID };
    return this.http.post(`${appConfig.api1111}/LawsuitupdDelete`, params);
  }

  LawsuiltArrestIndictmentupdDeleteArrestComplete(ARREST_ID: any): Observable<any> {
    const params = { ARREST_ID: ARREST_ID };
    return this.http.post(`${appConfig.api1111}/LawsuiltArrestIndictmentupdDeleteArrestComplete`, params);
  }

  LawsuiltArrestIndictmentupdDeleteIndictmentComplete(INDICTMENT_ID: any): Observable<any> {
    const params = { INDICTMENT_ID: INDICTMENT_ID };
    return this.http.post(`${appConfig.api1111}/LawsuiltArrestIndictmentupdDeleteIndictmentComplete`, params);
  }

  async LawsuitCompareDocumentgetByCon(LawsuitID) {
    const params = { LawsuitID: LawsuitID };
    const url = `${appConfig.api1111}/LawsuitCompareDocumentgetByCon`;
    return await this.http.post<any>(url, JSON.stringify(params), this.httpOptions).toPromise();
  }

  async LawsuitComparegetByLawsuitID(LawsuitID) {
    const params = { LAWSUIT_ID: LawsuitID };
    const url = `${appConfig.api1111}/LawsuiltComparegetByLawsuitID`;
    return await this.http.post<any>(url, JSON.stringify(params), this.httpOptions).toPromise();
  }

  async LawsuitProvegetByLawsuitID(LawsuitID) {
    const params = { LAWSUIT_ID: LawsuitID };
    const url = `${appConfig.api1111}/LawsuiltProvegetByLawsuitID`;
    return await this.http.post<any>(url, JSON.stringify(params), this.httpOptions).toPromise();
  }

  async LawsuitArrestCheckNotComplete(ArrestCode) {
    const params = { ArrestCode: ArrestCode };
    const url = `${appConfig.api1111}/LawsuitArrestCheckNotComplete`;
    return await this.http.post<any>(url, JSON.stringify(params), this.httpOptions).toPromise();
  }

  async LawsuitArrestIndicmentDetailupdByCon(IndictmentDetailID, LawsuitType, LawsuitEnd) {
    const params = {
      IndictmentDetailID: IndictmentDetailID,
      LawsuitType: LawsuitType,
      LawsuitEnd: LawsuitEnd
    };
    const url = `${appConfig.api1111}/LawsuitArrestIndicmentDetailupdByCon`;
    return await this.http.post<any>(url, JSON.stringify(params), this.httpOptions).toPromise();
  }
  async LawsuitArrestupdByCon(ArrestCode) {
    const params = {
      ArrestCode: ArrestCode,
    };
    const url = `${appConfig.api1111}/LawsuitArrestupdByCon`;
    return await this.http.post<any>(url, JSON.stringify(params), this.httpOptions).toPromise();
  }
  async MasCourtMaingetAll() {
    const params = {};
    const url = `${appConfig.api1111}/MasCourtMaingetAll`;
    return await this.http.post<any>(url, JSON.stringify(params), this.httpOptions).toPromise();
  }

  LawsuiltArrestIndictmentCheckComplete(ARREST_ID): Observable<any> {
    const params = { ARREST_ID: ARREST_ID }
    const url = `${appConfig.api1111}/LawsuiltArrestIndictmentCheckComplete`;
    return this.http.post<any>(url, params);
  }

  ILG60_00_04_001(LawsuitID) {
    const params = { LawsuitID };
    const url = `${appConfig.apiReport}/ILG60_00_04_001.aspx`;
    return this.http.post(url, params, { ...this.httpOptions, responseType: 'blob' })
      .catch(this.onCatch)
      .do((res: Response) => {
        this.onSuccess(res);
      }, (error: any) => {
        this.onError(error);
      })
      .map(x => x).finally(() => this.onEnd)
  }

  ILG60_00_04_002(ArrestCode) {
    const params = { ArrestCode };
    const url = `${appConfig.apiReport}/ILG60_00_04_002.aspx`;
    return this.http.post(url, params, { ...this.httpOptions, responseType: 'blob' })
      .catch(this.onCatch)
      .do((res: Response) => {
        this.onSuccess(res);
      }, (error: any) => {
        this.onError(error);
      })
      .map(x => x).finally(() => this.onEnd)
  }

  ILG60_00_06_004(LawsuitID) {
    const params = { LawsuitID };
    const url = `${appConfig.apiReport}/ILG60_00_06_004.aspx`;
    return this.http.post(url, params, { ...this.httpOptions, responseType: 'blob' })
      .catch(this.onCatch)
      .do((res: Response) => {
        this.onSuccess(res);
      }, (error: any) => {
        this.onError(error);
      })
      .map(x => x).finally(() => this.onEnd)
  }

  DocumentinsAll(form: any) {
    const formData = new FormData();
    formData.append('FILE', form.FILE);
    formData.append('DOCUMENT_NAME', form.DOCUMENT_NAME);
    formData.append('DOCUMENT_OLD_NAME', form.DOCUMENT_OLD_NAME);
    formData.append('DOCUMENT_TYPE', '4');
    formData.append('FOLDER', form.FOLDER);
    formData.append('REFERENCE_CODE', form.REFERENCE_CODE);
    const url = `${appConfig.api1111}/DocumentinsAll`;
    return this.http.post(url, formData);
  }

  DocumentupdDelete(form: updDelete) {
    const url = `${appConfig.api1111}/DocumentupdDelete`;
    return this.http.post<any>(url, form);
  }

  GetDocumentByCon(DOCUMENT_TYPE, REFERENCE_CODE) {
    const form = { DOCUMENT_TYPE, REFERENCE_CODE }
    const url = `${appConfig.api1111}/GetDocumentByCon`;
    return this.http.post(url, form);
  }

  getImage(DOCUMENT_ID: string) {
    return `${appConfig.api1111}/getImage.html/${DOCUMENT_ID}`
  }

  downloadFile(DOCUMENT_ID: string) {
    const url = `${appConfig.api1111}/downloadFile.html/${DOCUMENT_ID}`
    return this.http.get(url, { responseType: 'arraybuffer', headers: this.httpOptions.headers });
  }

  LawsuitPaymentinsAll(form: any): Observable<any> {
    return this.http.post(`${appConfig.api1111}/LawsuitPaymentinsAll`, [form]);
  }

  LawsuitPaymentupdDelete(params: any): Observable<any> {
    return this.http.post(`${appConfig.api1111}/LawsuitPaymentupdDelete`, params);
  }

  LawsuitPaymentgetByCon(LAWSUIT_DETAIL_ID: string): Promise<any> {
    const params = { LAWSUIT_DETAIL_ID: LAWSUIT_DETAIL_ID }
    const url = `${appConfig.api1111}/LawsuitPaymentgetByCon`;
    return this.http.post<any>(url, JSON.stringify(params), this.httpOptions).toPromise();
  }

  LawsuitMistreatNoupdDelete(params: any): Promise<any> {
    const url = `${appConfig.api1111}/LawsuitMistreatNoupdDelete`;
    return this.http.post<any>(url, JSON.stringify(params), this.httpOptions).toPromise();
  }

  private onEnd(): void {
    this.hideLoader();
  }

  private showLoader(): void {
    this.loaderService.show();
  }

  private hideLoader(): void {
    this.loaderService.hide();
  }

  private onSuccess(res: Response): void {
    console.log('Request successful');
  }

  private onError(res: Response): void {
    console.log('Error, status code: ' + res.status);
  }

  private onCatch(error: any, caught: Observable<any>): Observable<any> {
    return Observable.throw(error);
  }


}
