import { NoticeProduct } from "./notice-product";
import { Injectable, isDevMode } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { appConfig } from "../../app.config";
import { Notice } from "./notice";
import { Http } from "@angular/http";
import { updDelete } from "./notice-document";
import { Suspect, mas_person_address, mas_person_education, Mas_personRelationship } from "./suspect/suspect.interface";
import { NoticeSuspect } from "./notice-suspect";
import { NoticeStaff } from "./notice-staff";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable()
export class NoticeService {
  constructor(private http: HttpClient, private _http: Http) { }

  private httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json"
    })
  };

  I18N_VALUES = {
    weekdays: ['อ.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'],
    months: ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม']
  };

  public PipeResponseData(obj: Observable<any>) {
    return obj.pipe(map(x => {
      if (x == null || x == undefined)
        return [];
      if (x['SUCCESS'] == true || "True")
        return x['RESPONSE_DATA'].slice(0, 10);
      return [];
    }));
  }

  public PipeResponseSRP(obj: Observable<any>) {
    return obj.pipe(map(x => {
      if (x == null || undefined)
        return [];

      if (x['ResponseMessage'] == "SUCCESS")
        return x['ResponseData']
      return [];
    }));
  }

  public setOfficeName(input: any[] = []) {
    return input.reduce((a, c) => [...a, c.OFFICE_SHORT_NAME], []).slice(0, 10);
  }

  private async responsePromisModify(params: string, url: string) {
    const res = await this.http
      .post<any>(url, params, this.httpOptions)
      .toPromise();
    if (res.IsSuccess == "False") {
      return false;
    }
    return true && res;
  }


  /** ************************ NEW PH.2 *************************/
  async MasOfficegetByCon(OFFICE_CODE): Promise<any> {
    const params = { TEXT_SEARCH: OFFICE_CODE }
    const url = `${appConfig.api1111}/MasOfficegetByCon`
    return await this.http.post<any>(url, params, this.httpOptions).toPromise();
  }

  public MasOfficegetByCon_Search(params: any): Observable<any[]> {
    const res = this.http.post(`${appConfig.api1111}/MasOfficegetByCon`, params);
    return this.PipeResponseData(res).pipe(
      map(x => isDevMode() && !x.length ? [] : this.setOfficeName(x))
    );
  }

  public MasStaffgetByCon_Search(params: any): Observable<NoticeStaff[]> {
    const res = this.http.post(`${appConfig.api1111}/MasStaffgetByCon`, params);
    return this.PipeResponseData(res).pipe(
      map(x => isDevMode() && !x.length ? [] : x)
    );
  }

  public MasLocalegetByCon_Search(params: any): Observable<any[]> {
    const res = this.http.post(`${appConfig.api2222}/MasLocalegetByCon`, params);
    return this.PipeResponseData(res).pipe(
      map(x => isDevMode() && !x.length ? [] : x)
    );
  }

  DocumentinsAll(form: any) {
    const formData = new FormData();
    formData.append('FILE', form.FILE);
    formData.append('DOCUMENT_NAME', form.DOCUMENT_NAME);
    formData.append('DOCUMENT_OLD_NAME', form.DOCUMENT_OLD_NAME);
    formData.append('DOCUMENT_TYPE', '2');
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

  async getByKeyword(Textsearch: any, OfficeCode: any): Promise<Notice[]> {
    const params =
      Textsearch.TEXT_SEARCH == null ? { Textsearch: "" } : Textsearch;
    params.ACCOUNT_OFFICE_CODE = OfficeCode;
    const url = `${appConfig.api1111}/NoticeListgetByKeyword`;
    const res = await this.http
      .post<any>(url, params, this.httpOptions)
      .toPromise();
    if (res.IsSuccess === "False") {
      return new Array<Notice>();
    }
    return res;
  }

  async getByConAdv(form: any): Promise<Notice[]> {
    const url = `${appConfig.api1111}/NoticeListgetByConAdv`;
    const res = await this.http
      .post<any>(url, JSON.stringify(form), this.httpOptions)
      .toPromise();
    if (res.IsSuccess === "False") {
      return new Array<Notice>();
    }
    return res;
  }

  async getByCon(NOTICE_ID: string): Promise<Notice> {
    const params = { NOTICE_ID };
    const url = `${appConfig.api1111}/NoticegetByCon`;
    try {
      const res = await this.http.post<Notice>(url, params, this.httpOptions).toPromise();
      return res as any;
    } catch (error) {
      return new Notice();;
    }
  }

  NoticeupdByCon(form: Notice): Observable<any> {
    return this.http.post(`${appConfig.api1111}/NoticeupdByCon`, form);
  }

  NoticeProductupdByCon(NoticeProduct: NoticeProduct): Observable<any> {
    return this.http.post(`${appConfig.api1111}/NoticeProductupdByCon`, NoticeProduct);
  }

  NoticeProductupdDelete(PRODUCT_ID: string): Observable<any> {
    const params = { PRODUCT_ID: PRODUCT_ID };
    return this.http.post(`${appConfig.api1111}/NoticeProductupdDelete`, params);
  }

  NoticeProductinsAll(NoticeProduct: NoticeProduct): Observable<any> {
    return this.http.post(`${appConfig.api1111}/NoticeProductinsAll`, NoticeProduct);
  }

  NoticeSupectinsAll(suspect: NoticeSuspect): Observable<any> {
    return this.http.post(`${appConfig.api1111}/NoticeSupectinsAll`, suspect);
  }

  NoticeinsAll(form: Notice): Observable<any> {
    return this.http.post(`${appConfig.api1111}/NoticeinsAll`, form);
  }

  NoticeStaffinsAll(staff: NoticeStaff): Observable<any> {
    return this.http.post(`${appConfig.api1111}/NoticeStaffinsAll`, staff);
  }

  NoticeStaffupdByCon(staff: NoticeStaff): Observable<any> {
    return this.http.post(`${appConfig.api1111}/NoticeStaffupdByCon`, staff);
  }

  NoticeSuspectupdDelete(SUSPECT_ID: string): Observable<any> {
    const params = { SUSPECT_ID: SUSPECT_ID };
    return this.http.post(`${appConfig.api1111}/NoticeSuspectupdDelete`, params);
  }

  async NoticeupdDelete_Ph2(NOTICE_ID: string): Promise<any> {
    const params = { NOTICE_ID };
    const url = `${appConfig.api1111}/NoticeupdDelete`;
    return this.responsePromisModify(JSON.stringify(params), url);
  }

  NoticeStaffupdDelete(STAFF_ID: string): Observable<any> {
    const params = { STAFF_ID: STAFF_ID };
    return this.http.post(`${appConfig.api1111}/NoticeStaffupdDelete`, params);
  }

  //######################### MAS SERVICE ##############################
  async MasPersoninsAll(params): Promise<any> {
    const url = `${appConfig.api2222}/MasPersoninsAll`;
    return this.responsePromisModify(JSON.stringify(params), url);
  }

  async MasPersongetByCon(TEXT_SEARCH: string, PERSON_ID: string): Promise<any> {
    const params = { TEXT_SEARCH, PERSON_ID };
    const url = `${appConfig.api2222}/MasPersongetByCon`;
    try {
      const res = await this.http.post<Suspect>(url, params, this.httpOptions).toPromise();
      return res as any;
    } catch (error) {
      return new Suspect();;
    }
  }

  async MasPersonupdAll(Suspect: Suspect): Promise<any> {
    const params = Suspect;
    const url = `${appConfig.api2222}/MasPersonupdAll`;
    return this.responsePromisModify(JSON.stringify(params), url);
  }

  async MasPersonAddressupdAll(param: mas_person_address): Promise<any> {
    const params = param;
    const url = `${appConfig.api2222}/MasPersonAddressupdAll`;
    return this.responsePromisModify(JSON.stringify(params), url);
  }

  async MasPersonEducationupdAll(param: mas_person_education): Promise<any> {
    const params = param;
    const url = `${appConfig.api2222}/MasPersonEducationupdAll`;
    return this.responsePromisModify(JSON.stringify([params]), url);
  }

  async MasPersonEducationinsAll(param: mas_person_education): Promise<any> {
    const params = param;
    const url = `${appConfig.api2222}/MasPersonEducationinsAll`;
    return this.responsePromisModify(JSON.stringify(params), url);
  }

  async MasPersonRelationshipupdAll(param: Mas_personRelationship): Promise<any> {
    const params = param;
    const url = `${appConfig.api2222}/MasPersonRelationshipupdAll`;
    return this.responsePromisModify(JSON.stringify([params]), url);
  }

  async MasPersonRelationshipinsAll(param: Mas_personRelationship): Promise<any> {
    const params = param;
    const url = `${appConfig.api2222}/MasPersonRelationshipinsAll`;
    return this.responsePromisModify(JSON.stringify(params), url);
  }

  async MasPersonRelationshipupdDelete(PERSON_RELATIONSHIP_ID: string): Promise<any> {
    const params = { PERSON_RELATIONSHIP_ID };
    const url = `${appConfig.api2222}/MasPersonRelationshipupdDelete`;
    return this.responsePromisModify(JSON.stringify([params]), url);
  }

  async MasPersonEducationupdDelete(PERSON_EDUCATION_ID: string): Promise<any> {
    const params = { PERSON_EDUCATION_ID };
    const url = `${appConfig.api2222}/MasPersonEducationupdDelete`;
    return this.responsePromisModify(JSON.stringify([params]), url);
  }

  async MasPersonupdDelete(PERSON_ID: string): Promise<any> {
    const params = { PERSON_ID };
    const url = `${appConfig.api2222}/MasPersonupdDelete`;
    return this.responsePromisModify(JSON.stringify(params), url);
  }

  /** #################### ADD PRODUCT API ########################*/
  MasProductGROUPCategoryForLiquorgetByCon(): Promise<any> {
    const url = `${appConfig.api1111}/MasProductGROUPCategoryForLiquorgetByCon`;
    return this.http
      .post<any>(url, {}, this.httpOptions)
      .toPromise();
  }

  MasProductGroupgetByCon(PRODUCT_GROUP_CODE: string, PRODUCT_GROUP_ID: string): Promise<any> {
    const params = { PRODUCT_GROUP_CODE, PRODUCT_GROUP_ID }
    const url = `${appConfig.api1111}/MasProductGroupgetByCon`;
    return this.http
      .post<any>(url, params, this.httpOptions)
      .toPromise();
  }

  MasProductCategoryGroupgetByCon(CATEGORY_GROUP: string, PRODUCT_CODE: string): Promise<any> {
    const params = { CATEGORY_GROUP, PRODUCT_CODE }
    const url = `${appConfig.api1111}/MasProductCategoryGroupgetByCon`;
    return this.http
      .post<any>(url, params, this.httpOptions)
      .toPromise();
  }

  MasProductCategoryRDBgetByCon(CATEGORY_GROUP: string, PRODUCT_CODE: string): Promise<any> {
    const params = { CATEGORY_GROUP, PRODUCT_CODE }
    const url = `${appConfig.api1111}/MasProductCategoryRDBgetByCon`;
    return this.http
      .post<any>(url, params, this.httpOptions)
      .toPromise();
  }

  ////////////////////////////////
  MasProductMappinggetByConAdv(value): Promise<any> {
    const params = {
      PRODUCT_CODE: '',
      PRODUCT_GROUP_ID: value.PRODUCT_GROUP_ID,
      PRODUCT_NAME_DESC: value.PRODUCT_NAME_DESC
    }
    const url = `${appConfig.api1111}/MasProductMappinggetByConAdv`;
    return this.http
      .post<any>(url, params, this.httpOptions)
      .toPromise();
  }

  public MasProductMappinggetByKeyword(params: any): Promise<any> {
    const url = `${appConfig.api1111}/MasProductMappinggetByKeyword`;
    return this.http
      .post<any>(url, params, this.httpOptions)
      .toPromise();
  }
  /** ################## END NEW PH.2 ##################*/





  /** ################## EXCISE SERVICE ##################*/
  public DutyGroup(): Observable<any[]> {
    const params = {
      systemId: "WSS",
      userName: "wss001",
      password: "123456",
      ipAddress: "10.1.1.1",
      requestData: {}
    }
    const url = `${appConfig.XCS_DNS_SERVICE}/rdb/InquiryDutyGroup`;
    const res = this.http.post<any[]>(url, params);
    return this.PipeResponseSRP(res);
  }
  /** ################## END EXCISE SERVICE ##################*/




  ///################ Report Service ##################////
  public printRV1(noticeCode: any) {
    const params = { NoticeCode: noticeCode };
    const url = `${appConfig.apiReport}/ILG60_00_02_001.aspx`;
    return this.http
      .post(url, params, { ...this.httpOptions, responseType: "blob" })
      .map(res => res);
  }
  public printRV2(noticeCode: any) {
    const params = { NoticeCode: noticeCode };
    const url = `${appConfig.apiReport}/ILG60_00_02_002.aspx`;
    return this.http
      .post(url, params, { ...this.httpOptions, responseType: "blob" })
      .map(res => res);
  }
  ///################ End Report Service ##################////
}
