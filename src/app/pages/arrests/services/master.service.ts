import { Injectable, isDevMode } from "@angular/core";
import { ArrestHelperService } from "./arrest-helper.service";
import { Observable } from "rxjs";
import {
    IMasOffice,
    ISearchMasOffice,
    SearchByKeyword,
    MasLocale,
    IMasProductGroupgetByCon,
    IMasProductGroup,
    IMasProductCategory,
    IMasProductCategorygetByCon,
    IMasProductTypegetByCon,
    IMasProductType,
    IMasProductSubTypegetByCon,
    IMasProductSubType,
    IMasProductSubSetTypegetByCon,
    IMasProductSubSetType,
    IMasProductBrandgetByCon,
    IMasProductBrand,
    IMasProductSubBrandgetByCon,
    IMasProductSubBrand,
    IMasProductModelgetByCon,
    IMasProductModel,
    IMasProductMapping,
    IMasProductMappinggetByConAdv,
    MasLocaleMock,
    IMasProductMappingMock,
    IMasProductGroupMock,
    IMasProductCategoryMock,
    IMasProductBrandMock,
    MasOfficeMock,
    IMasCountrygetByCon,
    IMasTitle,
    IMasCountry,
    IMasTitlegetByCon,
    IMasRacegetByCon,
    IMasNationalitygetByCon,
    IMasNationality,
    IMasRace,
    IMasReligiongetByCon,
    IMasReligion,
    IMasRelationshipgetByCon,
    IMasRelationship,
    IMasProductGroupCategorygetByCon,
    IMasProductCategoryRDBgetByCon,
    IMasProductCategoryRDB,
    IMasProductCategoryGroup,
    IMasProductGROUPCategoryForLiquor
} from "../models";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map } from "rxjs/operators";
import { appConfig } from '../../../app.config'

@Injectable()
export class MasterService extends ArrestHelperService {
    constructor(private http: HttpClient) {
        super();
    }

    public searching: boolean;
    public searchFailed: boolean;
    public OFFICE_ID: number = parseInt(localStorage.getItem('OFFICE_ID')) || 2;

    private httpOptions = {
        headers: new HttpHeaders(
            {
                'Content-Type': 'application/json'
            })
    };

    public setOfficeName(input: any[] = []) {
        return input.reduce((a, c) => [...a, c.OFFICE_SHORT_NAME], []).slice(0, 10);
    }

    public MasOfficegetByCon_forSearch(params: ISearchMasOffice): Observable<IMasOffice[]> {
        const res = this.http.post(`${this.ArrestApiPrefixUrl}/MasOfficegetByCon`, params);
        return this.PipeResponseData(res).pipe(
            map(x => isDevMode() && !x.length ? [] : this.setOfficeName(x))
        );
    }

    public MasOfficegetByCon(params: ISearchMasOffice): Observable<IMasOffice[]> {
        const res = this.http.post(`${this.ArrestApiPrefixUrl}/MasOfficegetByCon`, params);
        return this.PipeResponseData(res).pipe(
            map(x => isDevMode() && !x.length ? [] : x)
        );
    }

    // public MasLocalegetByCon(params: SearchByKeyword): Observable<MasLocale[]> {
    //     const res = this.http.post(`${this.MasterApiPrefixUrl}/MasLocalegetByCon`, params);
    //     return this.PipeResponseData(res).pipe(
    //         map(x => isDevMode() && !x.length ? [] : x)
    //     );
    // }

    public MasLocalegetByCon(params: SearchByKeyword): Observable<MasLocale[]> {
        const res = this.http.post(`${this.MasterApiPrefixUrl}/MasLocalegetByCon`, params);
        return this.PipeResponseData(res).pipe(
            map(x => isDevMode() && !x.length ? [] : x)
        );
    }

    public MasProductMappinggetByKeyword(params: SearchByKeyword)
        : Observable<IMasProductMapping[]> {
        const res = this.http.post(`${this.ArrestApiPrefixUrl}/MasProductMappinggetByKeyword`, params);
        return res as Observable<IMasProductMapping[]>;
        // .pipe(
        //     map(x => isDevMode() && !x.length ? IMasProductMappingMock : x)
        // );
    }

    public MasProductMappinggetByConAdv(params: IMasProductMappinggetByConAdv)
        : Observable<IMasProductMapping[]> {
        const url = `${this.ArrestApiPrefixUrl}/MasProductMappinggetByConAdv`;
        const res = this.http.post<IMasProductMapping[]>(url, params);
        return res;
    }

    public MasProductGroupgetByCon(params?: IMasProductGroupgetByCon)
        : Observable<IMasProductGroup[]> {
        params = params ? params : { PRODUCT_GROUP_ID: "", PRODUCT_GROUP_CODE: "" };
        const url = `${this.ArrestApiPrefixUrl}/MasProductGroupgetByCon`;
        const res = this.http.post<IMasProductGroup[]>(url, params);
        return res;
    }

    public SRP(ProductGroupCode?: any, ProductDesc?: any, EffectiveDate?: any,)
        : Observable<any[]> {
        const params = {
            SystemId: "sssss",
            UserName: "train02",
            Password: "train02",
            IpAddress: "10.1.1.1",
            RequestData: {
                ProductGroupCode: ProductGroupCode,
                ProductDesc: ProductDesc,
                Barcode: "",
                EffectiveDate: EffectiveDate
            }
        }
        const url = `${appConfig.XCS_DNS_SERVICE}/prc/PrcInqProductByName`;
        const res = this.http.post<IMasProductGroup[]>(url, params);
        return this.PipeResponseSRP(res);
    }

    public DutyGroup(): Observable<any[]> {
        const params = {
            SystemId: "WSS",
            UserName: "wss001",
            Password: "123456",
            IpAddress: "10.1.1.1",
            RequestData: {}
        }
        const url = `${appConfig.XCS_DNS_SERVICE}/rdb/InquiryDutyGroup`;
        const res = this.http.post<IMasProductGroup[]>(url, params);
        return this.PipeResponseSRP(res);
    }

    public MasProductCategoryGroupgetByCon(params?: IMasProductGroupCategorygetByCon)
        : Observable<IMasProductCategoryGroup[]> {
        params = params ? params : { CATEGORY_GROUP: "", PRODUCT_CODE: "" };
        const url = `${this.ArrestApiPrefixUrl}/MasProductCategoryGroupgetByCon`;
        const res = this.http.post<IMasProductCategoryGroup[]>(url, params);
        return res;
        // .pipe(
        //     map(x => isDevMode() && !x.length ? IMasProductGroupMock : x)
        // );
    }

    public MasProductGROUPCategoryForLiquorgetByCon(): Observable<IMasProductGROUPCategoryForLiquor[]> {
        const url = `${this.ArrestApiPrefixUrl}/MasProductGROUPCategoryForLiquorgetByCon`;
        const params = {};
        const res = this.http.post<IMasProductGROUPCategoryForLiquor[]>(url, null);
        return res;
    }

    public MasProductCategoryRDBgetByCon(params?: IMasProductCategoryRDBgetByCon)
        : Observable<IMasProductCategoryRDB[]> {
        params = params ? params : { PRODUCT_CODE: "", CATEGORY_GROUP: "" };
        const url = `${this.ArrestApiPrefixUrl}/MasProductCategoryRDBgetByCon`;
        const res = this.http.post<IMasProductCategoryRDB[]>(url, params);
        return res;
    }

    public MasProductCategorygetByCon(params: IMasProductCategorygetByCon)
        : Observable<IMasProductCategory[]> {
        const res = this.http.post(`${this.ArrestApiPrefixUrl}/MasProductCategorygetByCon`, params);
        return this.PipeResponseData(res).pipe(
            map(x => isDevMode() && !x.length ? IMasProductCategoryMock : x)
        );
    }

    public MasProductTypegetByCon(params: IMasProductTypegetByCon)
        : Observable<IMasProductType[]> {
        const res = this.http.post(`${this.ArrestApiPrefixUrl}/MasProductTypegetByCon`, params);
        return this.PipeResponseData(res).pipe(
            map(x => isDevMode() && !x.length ? IMasProductType : x)
        );
    }

    public MasProductSubTypegetByCon(params: IMasProductSubTypegetByCon)
        : Observable<IMasProductSubType[]> {
        const res = this.http.post(`${this.ArrestApiPrefixUrl}/MasProductSubTypegetByCon`, params);
        return this.PipeResponseData(res);
    }

    public MasProductSubSetTypegetByCon(params: IMasProductSubSetTypegetByCon)
        : Observable<IMasProductSubSetType[]> {
        const res = this.http.post(`${this.ArrestApiPrefixUrl}/MasProductSubSetTypegetByCon`, params);
        return this.PipeResponseData(res);
    }

    public MasProductBrandgetByCon(params: IMasProductBrandgetByCon)
        : Observable<IMasProductBrand[]> {
        const res = this.http.post(`${this.ArrestApiPrefixUrl}/MasProductBrandgetByCon`, params);
        return this.PipeResponseData(res).pipe(
            map(x => isDevMode() && !x.length ? IMasProductBrandMock : x)
        );
    }

    public MasProductSubBrandgetByCon(params: IMasProductSubBrandgetByCon)
        : Observable<IMasProductSubBrand[]> {
        const res = this.http.post(`${this.ArrestApiPrefixUrl}/MasProductSubBrandgetByCon`, params);
        return this.PipeResponseData(res);
    }

    public MasProductModelgetByCon(params: IMasProductModelgetByCon)
        : Observable<IMasProductModel[]> {
        const res = this.http.post(`${this.ArrestApiPrefixUrl}/MasProductModelgetByCon`, params);
        return this.PipeResponseData(res);
    }

    public MasCountrygetByCon(params?: IMasCountrygetByCon)
        : Observable<IMasCountry[]> {
        params = !params ? { TEXT_SEARCH: "", COUNTRY_ID: null } : params;
        const res = this.http.post(`${this.MasterApiPrefixUrl}/MasCountrygetByCon`, params);
        return this.PipeResponseData(res);
    }

    public MasTitlegetByCon(params?: IMasTitlegetByCon)
        : Observable<IMasTitle[]> {
        params = !params ? { TEXT_SEARCH: "", TITLE_ID: null } : params;
        const res = this.http.post(`${this.MasterApiPrefixUrl}/MasTitlegetByCon`, params);
        return this.PipeResponseData(res);
    }

    public MasRacegetByCon(params?: IMasRacegetByCon)
        : Observable<IMasRace[]> {
        params = !params ? { TEXT_SEARCH: "", RACE_ID: null } : params;
        const res = this.http.post(`${this.MasterApiPrefixUrl}/MasRacegetByCon`, params);
        return this.PipeResponseData(res);
    }

    public MasNationalitygetByCon(params?: IMasNationalitygetByCon)
        : Observable<IMasNationality[]> {
        params = !params ? { TEXT_SEARCH: "", NATIONALITY_ID: null } : params;
        const res = this.http.post(`${this.MasterApiPrefixUrl}/MasNationalitygetByCon`, params);
        return this.PipeResponseData(res);
    }

    public MasReligiongetByCon(params?: IMasReligiongetByCon)
        : Observable<IMasReligion[]> {
        params = !params ? { TEXT_SEARCH: "", RELIGION_ID: null } : params;
        const res = this.http.post(`${this.MasterApiPrefixUrl}/MasReligiongetByCon`, params);
        return this.PipeResponseData(res);
    }

    public MasRelationshipgetByCon(params?: IMasRelationshipgetByCon)
        : Observable<IMasRelationship[]> {
        params = !params ? { TEXT_SEARCH: "", RELATIONSHIP_ID: null } : params;
        const res = this.http.post(`${this.MasterApiPrefixUrl}/MasRelationshipgetByCon`, params);
        return this.PipeResponseData(res);
    }

    public MasLocalegetByCon2(params) {
        const res = this.http.post(`${this.MasterApiPrefixUrl}/MasLocalegetByCon`, params).toPromise();
        return (res);
    }


    public serachOffice = (text2$: Observable<string>) =>
        text2$
            .debounceTime(200)
            .distinctUntilChanged()
            .do(() => this.searching = true)
            .switchMap(term =>
                this.MasOfficegetByCon({ TEXT_SEARCH: term })
                    .pipe(map(x => x.slice(0, 10)))
                    .do(() => this.searchFailed = false)
                    .catch(() => {
                        this.searchFailed = true;
                        return Observable.of([]);
                    })
            )
            .do(() => this.searching = false);


    public searchLocale = (text2$: Observable<string>) =>
        text2$
            .debounceTime(200)
            .distinctUntilChanged()
            .do(() => this.searching = true)
            .switchMap(term =>
                this.MasLocalegetByCon({ TEXT_SEARCH: term })
                    .pipe(map(x => x.slice(0, 10)))
                    .do(() => this.searchFailed = false)
                    .catch(() => {
                        this.searchFailed = true;
                        return Observable.of([]);
                    })
            )
            .do(() => this.searching = false);

    // public searchMasProductGroup = (text2$: Observable<string>) =>
    //     text2$
    //         .debounceTime(200)
    //         .distinctUntilChanged()
    //         .do(() => this.searching = true)
    //         .switchMap(term =>
    //             this.MasProductGroupgetByCon({ TEXT_SEARCH: term })
    //                 // .pipe(map(x => x.reduce((a, c) => [...a, c.PRODUCT_GROUP_NAME], [])))
    //                 .do(() => this.searchFailed = false)
    //                 .catch(() => {
    //                     this.searchFailed = true;
    //                     return Observable.of([]);
    //                 })
    //         )
    //         .do(() => this.searching = false);

    public searchMasProductCategory = (text2$: Observable<string>) =>
        text2$
            .debounceTime(200)
            .distinctUntilChanged()
            .do(() => this.searching = true)
            .switchMap(term =>
                this.MasProductCategorygetByCon({ TEXT_SEARCH: term })
                    .pipe(map(x => x.slice(0, 10)))
                    .do(() => this.searchFailed = false)
                    .catch(() => {
                        this.searchFailed = true;
                        return Observable.of([]);
                    })
            )
            .do(() => this.searching = false);

    public searchMasProductType = (text2$: Observable<string>) =>
        text2$
            .debounceTime(200)
            .distinctUntilChanged()
            .do(() => this.searching = true)
            .switchMap(term =>
                this.MasProductTypegetByCon({ TEXT_SEARCH: term })
                    .pipe(map(x => x.slice(0, 10)))
                    .do(() => this.searchFailed = false)
                    .catch(() => {
                        this.searchFailed = true;
                        return Observable.of([]);
                    })
            )
            .do(() => this.searching = false);

    public searchMasProductSubType = (text2$: Observable<string>) =>
        text2$
            .debounceTime(200)
            .distinctUntilChanged()
            .do(() => this.searching = true)
            .switchMap(term =>
                this.MasProductSubTypegetByCon({ TEXT_SEARCH: term })
                    .pipe(map(x => x.slice(0, 10)))
                    .do(() => this.searchFailed = false)
                    .catch(() => {
                        this.searchFailed = true;
                        return Observable.of([]);
                    })
            )
            .do(() => this.searching = false);

    public searchMasProductSubSetType = (text2$: Observable<string>) =>
        text2$
            .debounceTime(200)
            .distinctUntilChanged()
            .do(() => this.searching = true)
            .switchMap(term =>
                this.MasProductSubSetTypegetByCon({ TEXT_SEARCH: term })
                    .pipe(map(x => x.slice(0, 10)))
                    .do(() => this.searchFailed = false)
                    .catch(() => {
                        this.searchFailed = true;
                        return Observable.of([]);
                    })
            )
            .do(() => this.searching = false);

    public searchMasProductBrand = (text2$: Observable<string>) =>
        text2$
            .debounceTime(200)
            .distinctUntilChanged()
            .do(() => this.searching = true)
            .switchMap(term =>
                this.MasProductBrandgetByCon({ TEXT_SEARCH: term })
                    .pipe(map(x => x.slice(0, 10)))
                    .do(() => this.searchFailed = false)
                    .catch(() => {
                        this.searchFailed = true;
                        return Observable.of([]);
                    })
            )
            .do(() => this.searching = false);

    public searchMasProductSubBrand = (text2$: Observable<string>) =>
        text2$
            .debounceTime(200)
            .distinctUntilChanged()
            .do(() => this.searching = true)
            .switchMap(term =>
                this.MasProductSubBrandgetByCon({ TEXT_SEARCH: term })
                    .pipe(map(x => x.slice(0, 10)))
                    .do(() => this.searchFailed = false)
                    .catch(() => {
                        this.searchFailed = true;
                        return Observable.of([]);
                    })
            )
            .do(() => this.searching = false);

    public searchMasProductModel = (text2$: Observable<string>) =>
        text2$
            .debounceTime(200)
            .distinctUntilChanged()
            .do(() => this.searching = true)
            .switchMap(term =>
                this.MasProductModelgetByCon({ TEXT_SEARCH: term })
                    .pipe(map(x => x.slice(0, 10)))
                    .do(() => this.searchFailed = false)
                    .catch(() => {
                        this.searchFailed = true;
                        return Observable.of([]);
                    })
            )
            .do(() => this.searching = false);


    public searchMasCountry = (text2$: Observable<string>) =>
        text2$
            .debounceTime(200)
            .distinctUntilChanged()
            .do(() => this.searching = true)
            .switchMap(term =>
                this.MasCountrygetByCon({ TEXT_SEARCH: term })
                    .pipe(map(x => x.slice(0, 10)))
                    .do(() => this.searchFailed = false)
                    .catch(() => {
                        this.searchFailed = true;
                        return Observable.of([]);
                    })
            )
            .do(() => this.searching = false);

    public searchMasTitle = (text2$: Observable<string>) =>
        text2$
            .debounceTime(200)
            .distinctUntilChanged()
            .do(() => this.searching = true)
            .switchMap(term =>
                this.MasTitlegetByCon({ TEXT_SEARCH: term })
                    .pipe(map(x => x.slice(0, 10)))
                    .do(() => this.searchFailed = false)
                    .catch(() => {
                        this.searchFailed = true;
                        return Observable.of([]);
                    })
            )
            .do(() => this.searching = false);

    public searchMasRace = (text2$: Observable<string>) =>
        text2$
            .debounceTime(200)
            .distinctUntilChanged()
            .do(() => this.searching = true)
            .switchMap(term =>
                this.MasRacegetByCon({ TEXT_SEARCH: term })
                    .pipe(map(x => x.slice(0, 10)))
                    .do(() => this.searchFailed = false)
                    .catch(() => {
                        this.searchFailed = true;
                        return Observable.of([]);
                    })
            )
            .do(() => this.searching = false);

    public searchMasNationality = (text2$: Observable<string>) =>
        text2$
            .debounceTime(200)
            .distinctUntilChanged()
            .do(() => this.searching = true)
            .switchMap(term =>
                this.MasNationalitygetByCon({ TEXT_SEARCH: term })
                    .pipe(map(x => x.slice(0, 10)))
                    .do(() => this.searchFailed = false)
                    .catch(() => {
                        this.searchFailed = true;
                        return Observable.of([]);
                    })
            ).do(() => this.searching = false);

    public searchMasReligion = (text2$: Observable<string>) =>
        text2$
            .debounceTime(200)
            .distinctUntilChanged()
            .do(() => this.searching = true)
            .switchMap(term =>
                this.MasReligiongetByCon({ TEXT_SEARCH: term })
                    .pipe(map(x => x.slice(0, 10)))
                    .do(() => this.searchFailed = false)
                    .catch(() => {
                        this.searchFailed = true;
                        return Observable.of([]);
                    })
            ).do(() => this.searching = false);

    public searchMasRelationship = (text2$: Observable<string>) =>
        text2$
            .debounceTime(200)
            .distinctUntilChanged()
            .do(() => this.searching = true)
            .switchMap(term =>
                this.MasRelationshipgetByCon({ TEXT_SEARCH: term })
                    .pipe(map(x => x.slice(0, 10)))
                    .do(() => this.searchFailed = false)
                    .catch(() => {
                        this.searchFailed = true;
                        return Observable.of([]);
                    })
            ).do(() => this.searching = false);


    public searchTitle = (text2$: Observable<string>) =>
        text2$
            .debounceTime(200)
            .distinctUntilChanged()
            .do(() => this.searching = true)
            .switchMap(term =>
                this.MasTitlegetByCon({ TEXT_SEARCH: term })
                    .do(() => this.searchFailed = false)
                    .catch(() => {
                        this.searchFailed = true;
                        return Observable.of([]);
                    })
            )
            .do(() => this.searching = false);

}