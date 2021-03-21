import { Injectable, isDevMode } from '@angular/core';
import { HttpService } from 'app/core/http.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { appConfig } from 'app/app.config';
import { Observable } from 'rxjs';
import { LoaderService } from 'app/core/loader/loader.service';
import { map } from "rxjs/operators";
import { InvestigateStaff, MasLocale, MasLocaleMock, InvestigateMasSuspectModelUppercase } from '../models';

@Injectable()
export class InvestgateService {

  constructor(
    private http: HttpService,
    private httpClient: HttpClient,
    private loaderService: LoaderService
    ) { }

  private httpOptions = {
    headers: new HttpHeaders(
    {
      'Content-Type': 'application/json'
    })
  };

  version = '0.0.0.23'
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

  InvestigateDetailgetByCon(InvestigateDetailID: string) {
    const params = { InvestigateDetailID };
    const url = `${appConfig.apiReport}/ILG60_00_01_001.aspx`;
    this.showLoader();
    return this.httpClient.post(url, params, { ...this.httpOptions, responseType: 'blob' })
    .catch(this.onCatch)
    .do((res: Response) => {
      this.onSuccess(res);
    }, (error: any) => {
      this.onError(error);
    })
    .map(x => x)
    .finally(() => this.onEnd());
  }

  InvestigateListgetByKeyword(TEXT_SEARCH: string, ACCOUNT_OFFICE_CODE: string) {
    const params = { TEXT_SEARCH, ACCOUNT_OFFICE_CODE };
    const url = `${appConfig.api1121}/InvestigateListgetByKeyword`;
    return this.http.post(url, params).map(x => x.json());
  }

  InvestigateListgetByConAdv(form: any) {
    const params = form;
    const url = `${appConfig.api1121}/InvestigateListgetByConAdv`;
    return this.http.post(url, params).map(x => x.json());
  }

  InvestigategetByCon(InvestigateCode: string) {
    const params = { "INVESTIGATE_ID":InvestigateCode };
    const url = `${appConfig.api1121}/InvestigategetByCon`;
    return this.http.post(url, params).map(x => x.json());
  }

  async InvestigateinsAll(invest: any) {
    const params = invest;
    const url = `${appConfig.api1121}/InvestigateinsAll`;
    return await this.httpClient.post<any>(url, params, this.httpOptions).toPromise();
  }

  InvestigateupdAll(invest: any) {
    const params = invest;
    const url = `${appConfig.api1121}/InvestigateupdAll`;
    return this.http.post(url, params).map(x => x.json());
  }

  InvestigateupdByCon(invest: any) {
    const params = invest;
    const url = `${appConfig.api1121}/InvestigateupdByCon`;
    return this.http.post(url, params).map(x => x.json());
  }

  InvestigateupdDelete(InvestigateCode: string) {
    const params = { "INVESTIGATE_ID":InvestigateCode };
    const url = `${appConfig.api1121}/InvestigateupdDelete`;
    return this.http.post(url, params).map(x => x.json());
  }

  async InvestigateLawsuitResultCountgetByLawbreakerID(LawbreakerID: string) {
    const params = { LawbreakerID };
    const url = `${appConfig.api1121}/InvestigateLawsuitResultCountgetByLawbreakerID`;
    return await this.httpClient.post<any>(url, params, this.httpOptions).toPromise();
  }

  MasPersongetByConAdv() {
    const url = `${appConfig.api2222}/MasPersongetByConAdv`;
    return this.http.post(url, {}).map(x => x.json());
  }

  public MasLocalegetByCon_Search(params: any): Observable<any[]> {
    const res = this.http.post(`${appConfig.api2222}/MasLocalegetByCon`, params);
    return this.PipeResponseData(res).pipe(
      map(x => isDevMode() && !x.length ? [] : x)
    );
  }
  public PipeResponseData(obj: Observable<any>) {
    return obj.pipe(map(x => {
      if (x == null || x == undefined)
        return [];

      if (x['SUCCESS'] == true)
        return x['RESPONSE_DATA'];

      return [];
    }));
  }
  async MasPersoninsAll(params) {
    const url = `${appConfig.api2222}/MasPersoninsAll`;
    return await this.httpClient.post<any>(url, params, this.httpOptions).toPromise();
  }
  async MasPersongetByCon(TEXT_SEARCH: string, PERSON_ID: string): Promise<any> {
    const params = { TEXT_SEARCH, PERSON_ID };
    const url = `${appConfig.api2222}/MasPersongetByCon`;
    return this.httpClient.post<any>(url, params, this.httpOptions).toPromise();
  }
  async MasPersonupdAll(Suspect): Promise<any> {
    const params = Suspect;
    const url = `${appConfig.api2222}/MasPersonupdAll`;
    return this.http.post(url, params).map(x => x.json());
  }
  async MasPersonAddressupdAll(param): Promise<any> {
    const params = param;
    const url = `${appConfig.api2222}/MasPersonAddressupdAll`;
    return this.http.post(url, params).map(x => x.json());
  }
  async MasPersonEducationupdAll(param): Promise<any> {
    const params = param;
    const url = `${appConfig.api2222}/MasPersonEducationupdAll`;
    return this.http.post(url, params).map(x => x.json());
  }
  async MasPersonEducationinsAll(param): Promise<any> {
    const params = param;
    const url = `${appConfig.api2222}/MasPersonEducationinsAll`;
    return this.http.post(url, params).map(x => x.json());
  }
  async MasPersonRelationshipupdAll(param): Promise<any> {
    const params = param;
    const url = `${appConfig.api2222}/MasPersonRelationshipupdAll`;
    return this.http.post(url, params).map(x => x.json());
  }
  async MasPersonRelationshipinsAll(param): Promise<any> {
    const params = param;
    const url = `${appConfig.api2222}/MasPersonRelationshipinsAll`;
    return this.http.post(url, params).map(x => x.json());
  }
  async MasPersonRelationshipupdDelete(PERSON_RELATIONSHIP_ID: string): Promise<any> {
    const params = { PERSON_RELATIONSHIP_ID };
    const url = `${appConfig.api2222}/MasPersonRelationshipupdDelete`;
    return this.http.post(url, params).map(x => x.json());
  }
  async MasPersonEducationupdDelete(PERSON_EDUCATION_ID: string): Promise<any> {
    const params = { PERSON_EDUCATION_ID };
    const url = `${appConfig.api2222}/MasPersonEducationupdDelete`;
    return this.http.post(url, params).map(x => x.json());
  }
  async MasPersonupdDelete(PERSON_ID: string): Promise<any> {
    const params = { PERSON_ID };
    const url = `${appConfig.api2222}/MasPersonupdDelete`;
    return this.http.post(url, params).map(x => x.json());
  }

  DocumentinsAll(form: any) {
    const url = `${appConfig.api1111}/DocumentinsAll`;
    return this.httpClient.post(url, form);
  }
  DocumentupdDelete(form) {
    const url = `${appConfig.api1111}/DocumentupdDelete`;
    return this.httpClient.post(url, form);
  }
  GetDocumentByCon(DOCUMENT_TYPE, REFERENCE_CODE) {
    const form = { DOCUMENT_TYPE, REFERENCE_CODE }
    const url = `${appConfig.api1111}/GetDocumentByCon`;
    return this.httpClient.post(url, form);
  }
  getImage(DOCUMENT_ID: string) {
    return `${appConfig.api1111}/getImage.html/${DOCUMENT_ID}`
  }
  async MasProductGroupgetByCon(PRODUCT_GROUP_CODE: string, PRODUCT_GROUP_ID: string): Promise<any> {
    const params = { PRODUCT_GROUP_CODE, PRODUCT_GROUP_ID }
    const url = `${appConfig.api1111}/MasProductGroupgetByCon`;
    return this.httpClient
      .post<any>(url, params, this.httpOptions)
      .toPromise();
  }
  async MasProductCategoryGroupgetByCon(CATEGORY_GROUP: string, PRODUCT_CODE: string): Promise<any> {
    const params = { CATEGORY_GROUP, PRODUCT_CODE }
    const url = `${appConfig.api1111}/MasProductCategoryGroupgetByCon`;
    return this.httpClient
      .post<any>(url, params, this.httpOptions)
      .toPromise();
  }
  async MasProductCategoryRDBgetByCon(CATEGORY_GROUP: string, PRODUCT_CODE: string): Promise<any> {
    const params = { CATEGORY_GROUP, PRODUCT_CODE }
    const url = `${appConfig.api1111}/MasProductCategoryRDBgetByCon`;
    return this.httpClient
      .post<any>(url, params, this.httpOptions)
      .toPromise();
  }
  MasProductMappinggetByConAdv(value): Promise<any> {
    const params = {
      // PRODUCT_BRAND_NAME: value.PRODUCT_BRAND_NAME, 
      // PRODUCT_SUBBRAND_NAME: value.PRODUCT_SUBBRAND_NAME,
      // PRODUCT_MODEL_NAME_TH: value.PRODUCT_MODEL_NAME_TH

      CATEGORY_CODE: value.CATEGORY_CODE,
      CATEGORY_GROUP_CODE: value.CATEGORY_GROUP_CODE,
      IS_ACTIVE: 1,
      PRODUCT_BRAND_NAME: value.PRODUCT_BRAND_NAME,
      PRODUCT_GROUP_ID: value.PRODUCT_GROUP_ID,
      PRODUCT_MODEL_NAME: value.PRODUCT_MODEL_NAME,
      PRODUCT_SUBBRAND_NAME: value.PRODUCT_SUBBRAND_NAME
    }
    const url = `${appConfig.api1111}/MasProductMappinggetByConAdv`;
    return this.httpClient
      .post<any>(url, params, this.httpOptions)
      .toPromise();
  }

  public MasStaffgetByCon_Search(params: any): Observable<InvestigateStaff[]> {
    const res = this.httpClient.post(`${appConfig.api2222}/MasStaffgetByCon`, params);
    return this.PipeResponseData(res).pipe(
      map(x => isDevMode() && !x.length ? [] : x.slice(0, 10))
    );
  }

  public MasLocalegetByCon(params: any): Observable<MasLocale[]> {
    const res = this.httpClient.post(`${appConfig.api2222}/MasLocalegetByCon`, params);
    return this.PipeResponseData(res).pipe(
        map(x => isDevMode() && !x.length ? MasLocaleMock : x.slice(0, 10))
    );
}
}
