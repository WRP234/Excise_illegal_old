import { Injectable } from "@angular/core";
import { appConfig } from "app/app.config";
import { HttpService } from "app/core/http.service";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { LoaderService } from "app/core/loader/loader.service";
import { Observable } from "rxjs/Observable";
import { ArrestHelperService } from "./arrest-helper.service";
import { ArrestListgetByConAdv, ArrestList, SearchByKeyword, Arrest, ArrestupdDelete, ArrestgetByCon } from "../models";
import { map } from "rxjs/operators";

@Injectable()
export class ArrestService extends ArrestHelperService {

    constructor(
        private http: HttpService,
        private httpClient: HttpClient,
        private loaderService: LoaderService
    ) {
        super();
    }

    version = '0.0.0.76'

    private httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

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

    ArrestReportgetByCon(ArrestCode: string) {
        const params = { ArrestCode };
        const url = `${appConfig.apiReport}/ILG60_00_03_001.aspx`;
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

    ArrestListgetByConAdv(form: ArrestListgetByConAdv): Observable<ArrestList[]> {
        const res = this.http.post(`${this.ArrestApiPrefixUrl}/ArrestListgetByConAdv`, form);
        return res.pipe(map(x => x.json()));
    }

    ArrestgetByCon(form: ArrestgetByCon): Observable<Arrest> {
        const res = this.http.post(`${this.ArrestApiPrefixUrl}/ArrestgetByCon`, form);
        return res.pipe(map(x => x.json()));
    }

    ArrestListgetByKeyword(form: SearchByKeyword): Observable<ArrestList[]> {
        const res = this.http.post(`${this.ArrestApiPrefixUrl}/ArrestListgetByKeyword`, form);
        return res.pipe(map(x => x.json()));
    }

    ArrestinsAll(form: Arrest): Observable<any> {
        return this.httpClient.post(`${this.ArrestApiPrefixUrl}/ArrestinsAll`, form);
    }

    ArrestupdByCon(form: any): Observable<any> {
        return this.httpClient.post(`${this.ArrestApiPrefixUrl}/ArrestupdByCon`, form);
    }

    ArrestupdDelete(form: ArrestupdDelete): Observable<any> {
        return this.httpClient.post(`${this.ArrestApiPrefixUrl}/ArrestupdDelete`, form);
    }
}
