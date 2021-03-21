import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Http } from "@angular/http";
import { appConfig } from "app/app.config";

@Injectable()
export class ReportService {
    constructor(private http: HttpClient, private _http: Http) { }

    private httpOptions = {
        headers: new HttpHeaders({
            "Content-Type": "application/json"
        })
    };

    public ILG60_00_12_001(params: any) {
        const url = `${appConfig.apiReport}/ILG60_00_12_001.aspx`;
        // const url = `http://localhost:3979/ILG60_00_12_001.aspx`; //coloruntime
        return this.http
            .post(url, params, { ...this.httpOptions, responseType: "blob" })
            .map(res => res);
    }

    public ILG60_00_12_002(params: any) {
        const url = `${appConfig.apiReport}/ILG60_00_12_002.aspx`;
        // const url = `http://localhost:3979/ILG60_00_12_001.aspx`; //coloruntime
        return this.http
            .post(url, params, { ...this.httpOptions, responseType: "blob" })
            .map(res => res);
    }

    public ILG60_00_12_002_1(params: any) {
        const url = `${appConfig.apiReport}/ILG60_00_12_002_1.aspx`;
        // const url = `http://localhost:3979/ILG60_00_12_001.aspx`; //coloruntime
        return this.http
            .post(url, params, { ...this.httpOptions, responseType: "blob" })
            .map(res => res);
    }

    public ILG60_00_12_003(params: any) {
        const url = `${appConfig.apiReport}/ILG60_00_12_003.aspx`;
        // const url = `http://localhost:3979/ILG60_00_12_001.aspx`; //coloruntime
        return this.http
            .post(url, params, { ...this.httpOptions, responseType: "blob" })
            .map(res => res);
    }

    public ILG60_00_12_004(params: any) {
        const url = `${appConfig.apiReport}/ILG60_00_12_004.aspx`;
        // const url = `http://localhost:3979/ILG60_00_12_001.aspx`; //coloruntime
        return this.http
            .post(url, params, { ...this.httpOptions, responseType: "blob" })
            .map(res => res);
    }

    public ILG60_00_12_005(params) {
        const url = `${appConfig.apiReport}/ILG60_00_12_005.aspx`;
        return this.http
            .post(url, params, { ...this.httpOptions, responseType: "blob" })
            .map(res => res);
    }


    //###### Get office #######
    async EDOfficeDepartmentgetAll(): Promise<any> {
        const params = { TEXT_SEARCH: '' }
        const url = `${appConfig.api1111}/EDOfficeDepartmentgetAll`
        return await this.http.post<any>(url, params, this.httpOptions).toPromise();
    }

    async EDOfficeDepartmentgetbyCon(ACCOUNT_OFFICE_CODE): Promise<any> {
        const params = { ACCOUNT_OFFICE_CODE: ACCOUNT_OFFICE_CODE }
        const url = `${appConfig.api1111}/EDOfficeDepartmentgetbyCon`
        return await this.http.post<any>(url, params, this.httpOptions).toPromise();
    }

    async EDOfficeBranchgetbyCon(ACCOUNT_OFFICE_CODE): Promise<any> {
        const params = { ACCOUNT_OFFICE_CODE: ACCOUNT_OFFICE_CODE }
        const url = `${appConfig.api1111}/EDOfficeBranchgetbyCon`
        return await this.http.post<any>(url, params, this.httpOptions).toPromise();
    }


    //######### Get Products ###########
    MasProductGroupgetByCon(PRODUCT_GROUP_CODE: string, PRODUCT_GROUP_ID: string): Promise<any> {
        const params = { PRODUCT_GROUP_CODE, PRODUCT_GROUP_ID }
        const url = `${appConfig.api1111}/MasProductGroupgetByCon`;
        return this.http
            .post<any>(url, params, this.httpOptions)
            .toPromise();
    }
}
