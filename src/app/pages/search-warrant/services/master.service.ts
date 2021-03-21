import { Injectable, isDevMode } from '@angular/core';
import { ArrestHelperService } from './arrest-helper.service';
import { Observable } from 'rxjs/observable';
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
    IMasRelationship
} from '../models';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

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

    public MasOfficegetByCon(params: ISearchMasOffice): Observable<IMasOffice[]> {
        const res = this.http.post(`${this.MasterApiPrefixUrl}/MasOfficegetByCon`, params);
        return this.PipeResponseData(res).pipe(
            map(x => isDevMode() && !x.length ? MasOfficeMock : x)
        );
    }

    public MasLocalegetByCon(params: { TEXT_SEARCH: string }): Observable<MasLocale[]> {
        const res = this.http.post(`${this.MasterApiPrefixUrl}/MasLocalegetByCon`, params);
        return this.PipeResponseData(res).pipe(
            map(x => isDevMode() && !x.length ? MasLocaleMock : x)
        );
    }

    public MasProductMappinggetByKeyword(params: SearchByKeyword)
        : Observable<IMasProductMapping[]> {
        const res = this.http.post(`${this.MasterApiPrefixUrl}/MasProductMappinggetByKeyword`, params);
        return this.PipeResponseData(res).pipe(
            map(x => isDevMode() && !x.length ? IMasProductMappingMock : x)
        );
    }

    public MasProductMappinggetByConAdv(params: IMasProductMappinggetByConAdv)
        : Observable<IMasProductMapping[]> {
        const url = `${this.MasterApiPrefixUrl}/MasProductMappinggetByConAdv`;
        const res = this.http.post(url, params);
        return this.PipeResponseData(res).pipe(
            map(x => isDevMode() && !x.length ? IMasProductMappingMock : x)
        );
    }

    public MasProductGroupgetByCon(params: IMasProductGroupgetByCon)
        : Observable<IMasProductGroup[]> {
        const res = this.http.post(`${this.MasterApiPrefixUrl}/MasProductGroupgetByCon`, params);
        return this.PipeResponseData(res).pipe(
            map(x => isDevMode() && !x.length ? IMasProductGroupMock : x)
        );
    }

    public MasProductCategorygetByCon(params: IMasProductCategorygetByCon)
        : Observable<IMasProductCategory[]> {
        const res = this.http.post(`${this.MasterApiPrefixUrl}/MasProductCategorygetByCon`, params);
        return this.PipeResponseData(res).pipe(
            map(x => isDevMode() && !x.length ? IMasProductCategoryMock : x)
        );
    }

    public MasProductTypegetByCon(params: IMasProductTypegetByCon)
        : Observable<IMasProductType[]> {
        const res = this.http.post(`${this.MasterApiPrefixUrl}/MasProductTypegetByCon`, params);
        return this.PipeResponseData(res).pipe(
            map(x => isDevMode() && !x.length ? IMasProductType : x)
        );
    }

    public MasProductSubTypegetByCon(params: IMasProductSubTypegetByCon)
        : Observable<IMasProductSubType[]> {
        const res = this.http.post(`${this.MasterApiPrefixUrl}/MasProductSubTypegetByCon`, params);
        return this.PipeResponseData(res);
    }

    public MasProductSubSetTypegetByCon(params: IMasProductSubSetTypegetByCon)
        : Observable<IMasProductSubSetType[]> {
        const res = this.http.post(`${this.MasterApiPrefixUrl}/MasProductSubSetTypegetByCon`, params);
        return this.PipeResponseData(res);
    }

    public MasProductBrandgetByCon(params: IMasProductBrandgetByCon)
        : Observable<IMasProductBrand[]> {
        const res = this.http.post(`${this.MasterApiPrefixUrl}/MasProductBrandgetByCon`, params);
        return this.PipeResponseData(res).pipe(
            map(x => isDevMode() && !x.length ? IMasProductBrandMock : x)
        );
    }

    public MasProductSubBrandgetByCon(params: IMasProductSubBrandgetByCon)
        : Observable<IMasProductSubBrand[]> {
        const res = this.http.post(`${this.MasterApiPrefixUrl}/MasProductSubBrandgetByCon`, params);
        return this.PipeResponseData(res);
    }

    public MasProductModelgetByCon(params: IMasProductModelgetByCon)
        : Observable<IMasProductModel[]> {
        const res = this.http.post(`${this.MasterApiPrefixUrl}/MasProductModelgetByCon`, params);
        return this.PipeResponseData(res);
    }

    public MasCountrygetByCon(params: IMasCountrygetByCon)
        : Observable<IMasCountry[]> {
        const res = this.http.post(`${this.MasterApiPrefixUrl}/MasCountrygetByCon`, params);
        return this.PipeResponseData(res);
    }

    public MasTitlegetByCon(params: IMasTitlegetByCon)
        : Observable<IMasTitle[]> {
        const res = this.http.post(`${this.MasterApiPrefixUrl}/MasTitlegetByCon`, params);
        return this.PipeResponseData(res);
    }

    public MasRacegetByCon(params: IMasRacegetByCon)
        : Observable<IMasRace[]> {
        const res = this.http.post(`${this.MasterApiPrefixUrl}/MasRacegetByCon`, params);
        return this.PipeResponseData(res);
    }

    public MasNationalitygetByCon(params: IMasNationalitygetByCon)
        : Observable<IMasNationality[]> {
        const res = this.http.post(`${this.MasterApiPrefixUrl}/MasNationalitygetByCon`, params);
        return this.PipeResponseData(res);
    }

    public MasReligiongetByCon(params: IMasReligiongetByCon)
        : Observable<IMasReligion[]> {
        const res = this.http.post(`${this.MasterApiPrefixUrl}/MasReligiongetByCon`, params);
        return this.PipeResponseData(res);
    }

    public MasRelationshipgetByCon(params: IMasRelationshipgetByCon)
        : Observable<IMasRelationship[]> {
        const res = this.http.post(`${this.MasterApiPrefixUrl}/MasRelationshipgetByCon`, params);
        return this.PipeResponseData(res);
    }

    public MasCourtgetByConAdv(COURT_CODE: any, COURT_NAME: any)
        : Observable<any[]> {
        const params = { COURT_CODE: COURT_CODE, COURT_NAME: COURT_NAME }
        const res = this.http.post(`${this.MasterApiPrefixUrl}/MasCourtgetByConAdv`, params);
        return this.PipeResponseData(res);
    }



    public serachOffice = (text2$: Observable<string>) =>
        text2$
            .debounceTime(200)
            .distinctUntilChanged()
            .do(() => this.searching = true)
            .switchMap(term =>
                this.MasOfficegetByCon({ TEXT_SEARCH: term })
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
                    .do(() => this.searchFailed = false)
                    .catch(() => {
                        this.searchFailed = true;
                        return Observable.of([]);
                    })
            )
            .do(() => this.searching = false);

    public searchMasProductGroup = (text2$: Observable<string>) =>
        text2$
            .debounceTime(200)
            .distinctUntilChanged()
            .do(() => this.searching = true)
            .switchMap(term =>
                this.MasProductGroupgetByCon({ TEXT_SEARCH: term })
                    // .pipe(map(x => x.reduce((a, c) => [...a, c.PRODUCT_GROUP_NAME], [])))
                    .do(() => this.searchFailed = false)
                    .catch(() => {
                        this.searchFailed = true;
                        return Observable.of([]);
                    })
            )
            .do(() => this.searching = false);

    public searchMasProductCategory = (text2$: Observable<string>) =>
        text2$
            .debounceTime(200)
            .distinctUntilChanged()
            .do(() => this.searching = true)
            .switchMap(term =>
                this.MasProductCategorygetByCon({ TEXT_SEARCH: term })
                    // .pipe(map(x => x.reduce((a, c) => [...a, c.PRODUCT_CATEGORY_NAME], [])))
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
                    // .pipe(map(x => x.reduce((a, c) => [...a, c.PRODUCT_TYPE_NAME], [])))
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
                    // .pipe(map(x => x.reduce((a, c) => [...a, c.PRODUCT_SUBTYPE_NAME], [])))
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
                    // .pipe(map(x => x.reduce((a, c) => [...a, c.PRODUCT_SUBSETTYPE_NAME], [])))
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
                    // .pipe(map(x => x.reduce((a, c) => [...a, c.PRODUCT_BRAND_NAME_TH], [])))
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
                    // .pipe(map(x => x.reduce((a, c) => [...a, c.PRODUCT_SUBBRAND_NAME_TH], [])))
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
                    // .pipe(map(x => x.reduce((a, c) => [...a, c.PRODUCT_MODEL_NAME_TH], [])))
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
                    .do(() => this.searchFailed = false)
                    .catch(() => {
                        this.searchFailed = true;
                        return Observable.of([]);
                    })
            ).do(() => this.searching = false);
}
