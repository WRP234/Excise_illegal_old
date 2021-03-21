import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { appConfig } from "app/app.config";
import { HttpService } from "app/core/http.service";
import { MasDocumentModel } from "app/models/mas-document.model";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable()
export class MainMasterService {
  constructor(private http: HttpClient, private httpService: HttpService) {}

  private httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
    }),
  };

  public PipeResponseData(obj: Observable<any>) {
    return obj.pipe(
      map((x) => {
        if (x == null || undefined) return [];

        if (x["SUCCESS"] == true || "True") return x["RESPONSE_DATA"];

        return [];
      })
    );
  }

  private async resposePromisGetList(params: string, url: string) {
    const res = await this.http
      .post<any>(url, params, this.httpOptions)
      .toPromise();
    if (!res.length || res.IsSuccess == "False") {
      return [];
    }
    return res;
  }

  callApi(url: string): Promise<any[]> {
    return this.resposePromisGetList("{}", url);
  }

  MasStaffMaingetAll() {
    return this.callApi(`${appConfig.api1111}/MasStaffMaingetAll`);
  }
  MasDepartmentMaingetAll() {
    return this.callApi(`${appConfig.api1111}/MasDepartmentMaingetAll`);
  }
  MasOfficeMaingetAll() {
    return this.callApi(`${appConfig.api1111}/MasOfficeMaingetAll`);
  }
  MasDistrictMaingetAll() {
    return this.callApi(`${appConfig.api1111}/MasDistrictMaingetAll`);
  }
  MasDutyUnitMaingetAll() {
    return this.callApi(`${appConfig.api1111}/MasDutyUnitMaingetAll`);
  }
  MasProductMaingetAll() {
    return this.callApi(`${appConfig.api1111}/MasProductMaingetAll`);
  }
  MasCourtMaingetAll() {
    return this.callApi(`${appConfig.api1111}/MasCourtMaingetAll`);
  }
  MasCommunicationchanelMaingetAll() {
    return this.callApi(
      `${appConfig.api1111}/MasCommunicationchanelMaingetAll`
    );
  }
  MasTitleMaingetAll() {
    return this.callApi(`${appConfig.api1111}/MasTitleMaingetAll`);
  }
  MasNationalityMaingetAll() {
    return this.callApi(`${appConfig.api1111}/MasNationalityMaingetAll`);
  }
  MasRaceMaingetAll() {
    return this.callApi(`${appConfig.api1111}/MasRaceMaingetAll`);
  }
  MasReligionMaingetAll() {
    return this.callApi(`${appConfig.api1111}/MasReligionMaingetAll`);
  }
  MasCountryMaingetAll() {
    return this.callApi(`${appConfig.api1111}/MasCountryMaingetAll`);
  }
  MasDocumentMaingetAll(
    DocumentType: string,
    ReferenceCode: string
  ): Promise<MasDocumentModel[]> {
    const params = { DocumentType, ReferenceCode };
    return this.resposePromisGetList(
      JSON.stringify(params),
      `${appConfig.api1111}/MasDocumentMaingetAll`
    );
  }

  async SecondPartLevelCode(param): Promise<any> {
    const params = { SecondPartLevelCode: param };
    return this.resposePromisGetList(
      JSON.stringify(params),
      `${appConfig.api1111}/MasRewardSecondDivisionRateMaingetBySecondPartLevelCode`
    );
  }

  masStaffMaingetAll(): Promise<any[]> {
    const url = `${appConfig.api1111}/MasStaffMaingetAll`;
    return this.resposePromisGetList("{}", url);
  }

  masDepartmentMaingetAll(): Promise<any[]> {
    const url = `${appConfig.api1111}/MasDepartmentMaingetAll`;
    return this.resposePromisGetList("{}", url);
  }
  masOfficeMaingetAll(): Promise<any[]> {
    const url = `${appConfig.api1111}/MasOfficeMaingetAll`;
    return this.resposePromisGetList("{}", url);
  }
  masDistrictMaingetAll(): Promise<any[]> {
    const url = `${appConfig.api1111}/MasDistrictMaingetAll`;
    return this.resposePromisGetList("{}", url);
  }
  masDutyUnitMaingetAll(): Promise<any[]> {
    const url = `${appConfig.api1111}/MasDutyUnitMaingetAll`;
    return this.resposePromisGetList("{}", url);
  }
  masProductMaingetAll(): Promise<any[]> {
    const url = `${appConfig.api1111}/MasProductMaingetAll`;
    return this.resposePromisGetList("{}", url);
  }
  masCourtMaingetAll(): Promise<any[]> {
    const url = `${appConfig.api1111}/MasCourtMaingetAll`;
    return this.resposePromisGetList("{}", url);
  }
  masCommunicationchanelMaingetAll(): Promise<any[]> {
    const url = `${appConfig.api1111}/MasCommunicationchanelMaingetAll`;
    return this.resposePromisGetList("{}", url);
  }

  /** ################# PH.2 #################### */  //MasLocaleByCon port2222
  async MasLocaleByCon(): Promise<any> {
    const params = { TEXT_SEARCH: "", SUB_DISTRICT_ID: "" };
    const url = `${appConfig.api1111}/MasLocalegetByCon`;
    return await this.http.post<any>(url, params, this.httpOptions).toPromise();
  }
  async MasLocalegetByCon(): Promise<any> {
    const params = { TEXT_SEARCH: "" };
    const url = `${appConfig.api2222}/MasLocalegetByCon`;
    return await this.http.post<any>(url, params, this.httpOptions).toPromise();
  }
  async MasOfficegetByCon(): Promise<any> {
    const params = { TEXT_SEARCH: "" };
    const url = `${appConfig.api1111}/MasOfficegetByCon`;
    return await this.http.post<any>(url, params, this.httpOptions).toPromise();
  }
  async MasStaffgetByCon(TEXT_SEARCH): Promise<any> {
    const params = { TEXT_SEARCH };
    const url = `${appConfig.api2222}/MasStaffgetByCon`;
    return await this.http.post<any>(url, params, this.httpOptions).toPromise();
  }
  async MasStaffgetByCon1(TEXT_SEARCH): Promise<any> {
    const params = { TEXT_SEARCH };
    const url = `${appConfig.api1111}/MasStaffgetByCon`;
    return await this.http.post<any>(url, params, this.httpOptions).toPromise();
  }
  async MasStaff(STAFF_ID, TEXT_SEARCH): Promise<any> {
    const params = { STAFF_ID, TEXT_SEARCH };
    const url = `${appConfig.api1111}/MasStaffgetByCon`;
    return await this.http.post<any>(url, params, this.httpOptions).toPromise();
  }

  async MasTitlegetByCon() {
    const params = { TEXT_SEARCH: "", TITLE_ID: "" };
    const url = `${appConfig.api2222}/MasTitlegetByCon`;
    return await this.http.post<any>(url, params, this.httpOptions).toPromise();
  }
  async MasRacegetByCon() {
    const params = { TEXT_SEARCH: "", RACE_ID: "" };
    const url = `${appConfig.api2222}/MasRacegetByCon`;
    return await this.http.post<any>(url, params, this.httpOptions).toPromise();
  }
  async MasNationalitygetByCon() {
    const params = { TEXT_SEARCH: "", NATIONALITY_ID: "" };
    const url = `${appConfig.api2222}/MasNationalitygetByCon`;
    return await this.http.post<any>(url, params, this.httpOptions).toPromise();
  }
  async MasReligiongetByCon() {
    const params = { TEXT_SEARCH: "", RELIGION_ID: "" };
    const url = `${appConfig.api2222}/MasReligiongetByCon`;
    return await this.http.post<any>(url, params, this.httpOptions).toPromise();
  }
  async MasRelationshipgetByCon() {
    const params = { TEXT_SEARCH: "", RELATIONSHIP_ID: "" };
    const url = `${appConfig.api2222}/MasRelationshipgetByCon`;
    return await this.http.post<any>(url, params, this.httpOptions).toPromise();
  }
  async MasCountrygetByCon() {
    const params = { TEXT_SEARCH: "", COUNTRY_ID: "" };
    const url = `${appConfig.api2222}/MasCountrygetByCon`;
    return await this.http.post<any>(url, params, this.httpOptions).toPromise();
  }
  async MasDistrictgetByCon(): Promise<any> {
    const params = {};
    const url = `${appConfig.api2222}/MasDistrictgetByCon`;
    return await this.http.post<any>(url, params, this.httpOptions).toPromise();
  }

  MasSubDistrictgetByCon(params?: any): Observable<any[]> {
    params = !params ? { TEXT_SEARCH: "", SUB_DISTRICT_ID: null } : params;
    const res = this.http.post(
      `${appConfig.api2222}/MasSubDistrictgetByCon`,
      params
    );
    return this.PipeResponseData(res);
  }
}
