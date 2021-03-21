import { Injectable, isDevMode } from '@angular/core';
import { ArrestHelperService } from './arrest-helper.service';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { IMasStaffgetByCon, IMasStaffgetByConAdv } from '../../model';
import { ArrestStaff } from '../model';
import { ArrestStaffMock, MasLocale, MasLocaleMock, SearchByKeyword } from '../../arrests/models';
import { map } from 'rxjs/operators';
import { Puritycert } from '../puritycert';
// @ts-ignore
import { appConfig } from '../../../app.config';

@Injectable()
export class MasStaffService extends ArrestHelperService {
  public searching: boolean;
  public searchFailed: boolean;
  constructor(private http: HttpClient) {
    super();
  }

    public MasStaffgetByCon(params: any): Observable<ArrestStaff[]> {
        const res = this.http.post(`${appConfig.api1111}/MasStaffgetByCon`, params);
        // @ts-ignore
      return  res;

  }


  // public MasStaffgetByCon(params: IMasStaffgetByCon): Observable<ArrestStaff[]> {
  //   const res = this.http.post(`${this.MasterApiPrefixUrl}/MasStaffgetByCon`, params);
  //   return this.PipeResponseData(res).pipe(
  //     map(x => isDevMode() && !x.length ? ArrestStaffMock : x)
  //   );
  // }

  MasStaffgetByConAdv(params: IMasStaffgetByConAdv): Observable<ArrestStaff[]> {
    const res = this.http.post(`${this.MasterApiPrefixUrl}/MasStaffgetByConAdv`, params);
    return this.PipeResponseData(res);
  }

  // public searchStaff = (text2$: Observable<string>) =>
  //   text2$.pipe()
  //     .debounceTime(200)
  //     .distinctUntilChanged()
  //     .do(() => this.searching = true)
  //     .switchMap(term =>
  //       this.MasStaffgetByCon({ TEXT_SEARCH: term })
  //         .do(() => this.searchFailed = false)
  //         .catch(() => {
  //           this.searchFailed = true;
  //           return Observable.of([]);
  //         })
  //     )
  //     .do(() => this.searching = false);
  public searchStaff = (text2$: Observable<string>) =>
    text2$
      .debounceTime(200)
      .distinctUntilChanged()
      .do(() => this.searching = true)
      .switchMap(term =>
        this.MasStaffgetByCon({ TEXT_SEARCH: term })
          .do(() => this.searchFailed = false)
          .catch(() => {
            this.searchFailed = true;
            return Observable.of([]);
          })
      )
      .do(() => this.searching = false);
  //
  // search = (text$: Observable<string>) =>
  //   text$.pipe(
  //     debounceTime(200),
  //     map(term => term === '' ? []
  //       : statesWithFlags.filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
  //   )

}
