import { Injectable } from '@angular/core';
import { HttpService } from '../../../core/http.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoaderService } from '../../../core/loader/loader.service';
import { Observable } from 'rxjs/Observable';
import { SearchByKeyword } from '../models/search-by-keyword';
import { map } from 'rxjs/operators';
import { SearchWarrantHelperService } from './search-warrant-helper.service';
import { SearchWarrant } from '../models/search-warrant';
import { SearchWarrantListGetByConAdv } from '../models/search-by-adv';
import {UpdDelete} from '../models/upd-delete';
import {UpdByCon} from '../models/upd-by-con';
import {InsAll} from '../models/ins-all';
import {ListSearchWarrant} from "../models/list-search-warrant";

@Injectable()
export class SearchWarrantService extends SearchWarrantHelperService {

  constructor(
    private http: HttpService,
    private httpClient: HttpClient,
    private loaderService: LoaderService
  ) {
    super();
  }

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

  SearchWarrantListGetByKeyword(form: SearchByKeyword): Observable<ListSearchWarrant[]> {
    const res = this.http.post(`${this.SearchWarrantApiPrefixUrl}/searchWarrantRequestGetByKeyword`, form);
    return res.pipe(map(x => x.json()));
  }

  searchWarrantRequestByConAdv(form: SearchWarrantListGetByConAdv): Observable<ListSearchWarrant[]> {
    const res = this.http.post(`${this.SearchWarrantApiPrefixUrl}/searchWarrantRequestGetByConAdv`, form);
    return res.pipe(map(x => x.json()));
  }

  searchWarrantRequestGetByCon(form: UpdDelete): Observable<SearchWarrant> {
    const res = this.http.post(`${this.SearchWarrantApiPrefixUrl}/searchWarrantRequestGetByCon`, form);
    return res.pipe(map(x => x.json()));
  }

  searchWarrantRequestInsAll(form: InsAll): Observable<SearchWarrant> {
    const res = this.http.post(`${this.SearchWarrantApiPrefixUrl}/SearchWarrantRequestInsAll`, form);
    return res.pipe(map(x => x.json()));
  }

  searchWarrantRequestUpdByCon(form: UpdByCon): Observable<SearchWarrant> {
    const res = this.http.post(`${this.SearchWarrantApiPrefixUrl}/SearchWarrantRequestUpdByCon`, form);
    return res.pipe(map(x => x.json()));
  }

  searchWarrantRequestUpdDelete(form: UpdDelete): Observable<SearchWarrant> {
    const res = this.http.post(`${this.SearchWarrantApiPrefixUrl}/SearchWarrantRequestUpdDelete`, form);
    return res.pipe(map(x => x.json()));
  }
}
